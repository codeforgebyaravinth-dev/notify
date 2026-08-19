import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import Stripe from 'stripe';
import { ApiServiceLevelEnum } from '@novu/shared';
import { OrganizationRepository } from '@novu/dal';

@Injectable()
export class StripeService {
  private logger = new Logger(StripeService.name);
  private stripe?: Stripe;
  private organizationRepository: OrganizationRepository;

  constructor(private moduleRef: ModuleRef) {
    const apiKey = process.env.STRIPE_SECRET_KEY || '';
    if (apiKey) {
      this.stripe = new Stripe(apiKey, { apiVersion: '2022-11-15' as any });
      this.logger.log('Stripe initialized.');
    } else {
      this.logger.warn('STRIPE_API_KEY is not defined. Billing will not work correctly.');
    }
  }

  async getSubscriptionStatus(organizationId: string) {
    if (!this.stripe) {
      return this.getDefaultFreeTierStatus();
    }

    if (!this.organizationRepository) {
      this.organizationRepository = this.moduleRef.get(OrganizationRepository, { strict: false });
    }

    try {
      const org = await this.organizationRepository.findById(organizationId);
      if (!org?.stripeCustomerId) {
        return this.getDefaultFreeTierStatus();
      }

      const subscriptions = await this.stripe.subscriptions.list({
        customer: org.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0];
        const priceId = sub.items.data[0]?.price.id;
        const productId = sub.items.data[0]?.price.product;

        let apiServiceLevel = ApiServiceLevelEnum.PRO;
        const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
        const bizPriceId = process.env.STRIPE_BUSINESS_PRICE_ID;

        if (priceId === bizPriceId) {
          apiServiceLevel = ApiServiceLevelEnum.BUSINESS;
        } else if (priceId !== proPriceId && typeof productId === 'string') {
          const product = await this.stripe.products.retrieve(productId);
          if (product.name.toLowerCase().includes('business') || product.name.toLowerCase().includes('team')) {
            apiServiceLevel = ApiServiceLevelEnum.BUSINESS;
          }
        }

        return {
          apiServiceLevel,
          isActive: true,
          hasPaymentMethod: true,
          status: sub.status,
          currentPeriodStart: new Date(sub.current_period_start * 1000).toISOString(),
          currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          billingInterval: sub.items.data[0]?.plan.interval || 'month',
          events: { current: 0, included: 10000 },
          trial: { isActive: false, start: null, end: null, daysTotal: 0 },
          cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
        };
      }
    } catch (e: any) {
      this.logger.error(`Failed to fetch subscription for org ${organizationId}`, e);
    }

    return this.getDefaultFreeTierStatus();
  }

  private getDefaultFreeTierStatus() {
    return {
      apiServiceLevel: ApiServiceLevelEnum.FREE,
      isActive: false,
      hasPaymentMethod: false,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      billingInterval: 'month',
      events: { current: 0, included: 10000 },
      trial: { isActive: false, start: null, end: null, daysTotal: 0 },
      cancelAt: null,
    };
  }

  async createCheckoutSession(organizationId: string, email?: string, billingInterval?: 'month' | 'year', apiServiceLevel?: string) {
    if (!this.stripe || !billingInterval || !apiServiceLevel) return '';
    try {
      // Find the corresponding prices based on the catalog lookup keys
      const intervalKey = billingInterval === 'month' ? 'monthly' : 'annual';
      const lookupKeys = [
        `${apiServiceLevel}_${intervalKey}`,
        `${apiServiceLevel}_metered_runs`,
        `${apiServiceLevel}_metered_conversations`
      ];

      const prices = await this.stripe.prices.list({
        lookup_keys: lookupKeys,
        active: true,
        expand: ['data.product'],
      });

      if (prices.data.length === 0) {
        throw new Error('No prices found for the selected plan.');
      }

      const lineItems = prices.data.map(price => ({ 
        price: price.id,
        ...(price.recurring && price.recurring.usage_type === 'metered' ? {} : { quantity: 1 })
      }));

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: lineItems,
        success_url: `${process.env.FRONT_BASE_URL}/settings/billing?success=true`,
        cancel_url: `${process.env.FRONT_BASE_URL}/settings/billing?canceled=true`,
        customer_email: email,
        client_reference_id: organizationId,
        metadata: {
          apiServiceLevel
        }
      });
      return session.url || '';
    } catch (e: any) {
      this.logger.error('Failed to create checkout session', e);
      return 'https://stripe.com/checkout';
    }
  }

  async createPortalSession(organizationId: string) {
    const baseUrl = process.env.FRONT_BASE_URL || 'http://localhost:4200';
    return `${baseUrl}/settings/billing?portal_mock=true`;
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    if (!this.stripe) return;

    const secret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (!this.organizationRepository) {
      this.organizationRepository = this.moduleRef.get(OrganizationRepository, { strict: false });
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const organizationId = session.client_reference_id;
          const customerId = session.customer as string;
          const apiServiceLevel = session.metadata?.apiServiceLevel as ApiServiceLevelEnum || ApiServiceLevelEnum.PRO;

          if (organizationId && customerId) {
            await this.organizationRepository.update(
              { _id: organizationId },
              { stripeCustomerId: customerId, apiServiceLevel }
            );
            this.logger.log(`Linked org ${organizationId} to Stripe Customer ${customerId} at level ${apiServiceLevel}`);
          }
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          if (customerId) {
            const orgs = await this.organizationRepository.find({ stripeCustomerId: customerId });
            for (const org of orgs) {
              await this.organizationRepository.update(
                { _id: org._id },
                { apiServiceLevel: ApiServiceLevelEnum.FREE }
              );
              this.logger.log(`Downgraded org ${org._id} to FREE due to subscription deletion`);
            }
          }
          break;
        }
        case 'customer.subscription.updated': {
          // Additional logic for subscription updates (e.g. tracking plan changes) could go here
          this.logger.log('Subscription updated received.');
          break;
        }
        default:
          this.logger.debug(`Unhandled event type ${event.type}`);
      }
    } catch (e: any) {
      this.logger.error(`Error processing webhook event ${event.type}`, e);
    }

    return { received: true };
  }
}
