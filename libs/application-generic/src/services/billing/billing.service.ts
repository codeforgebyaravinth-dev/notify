import { Injectable, Logger } from '@nestjs/common';
import { ProvidersIdEnum, EmailProviderIdEnum, SmsProviderIdEnum, PushProviderIdEnum } from '@novu/shared';
import Stripe from 'stripe';
import { OrganizationRepository } from '@novu/dal';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  private stripe: Stripe | null = null;

  constructor(private organizationRepository: OrganizationRepository) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
    if (stripeSecretKey) {
      this.stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2022-11-15',
      });
    }
  }

  /**
   * Reports the usage of a managed provider for metered billing.
   */
  async reportUsage(organizationId: string, providerId: ProvidersIdEnum | string, channel: string) {
    const managedProviders: string[] = [
      SmsProviderIdEnum.Notify,
      EmailProviderIdEnum.Notify,
      PushProviderIdEnum.Notify,
      SmsProviderIdEnum.Novu,
      EmailProviderIdEnum.Novu,
      PushProviderIdEnum.Novu,
    ];

    if (!managedProviders.includes(providerId)) {
      return; // Not a managed provider, no usage tracking needed
    }

    if (!this.stripe) {
      this.logger.warn('[BillingService] Stripe is not configured. Skipping usage report.');
      return;
    }

    try {
      const org = await this.organizationRepository.findById(organizationId);
      if (!org?.stripeCustomerId) {
        this.logger.debug(`[BillingService] No Stripe Customer ID for org ${organizationId}`);
        return;
      }

      // Find active subscription for this customer
      const subscriptions = await this.stripe.subscriptions.list({
        customer: org.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data.length === 0) {
        this.logger.debug(`[BillingService] No active Stripe subscription found for customer ${org.stripeCustomerId}`);
        return;
      }

      const subscription = subscriptions.data[0];
      
      // We assume there's a metered subscription item. We'll find it by looking for recurring.usage_type === 'metered'
      const meteredItem = subscription.items.data.find(item => item.price.recurring?.usage_type === 'metered');

      if (!meteredItem) {
        this.logger.debug(`[BillingService] No metered subscription item found for subscription ${subscription.id}`);
        return;
      }

      await this.stripe.subscriptionItems.createUsageRecord(
        meteredItem.id,
        { quantity: 1, timestamp: Math.floor(Date.now() / 1000), action: 'increment' }
      );
      this.logger.log(`[BillingService] Successfully reported 1 usage event for managed provider '${providerId}' (subscription item ${meteredItem.id})`);
    } catch (error) {
      this.logger.error(
        `Failed to report usage for organization ${organizationId} and provider ${providerId}`,
        error
      );
    }
  }
}
