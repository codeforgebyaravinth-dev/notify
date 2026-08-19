import { DynamicModule, Module } from '@nestjs/common';
import { QuotaThrottlerInterceptor } from './quota-throttler.interceptor';
import { StripeService } from './stripe.service';
import { BillingController } from './billing.controller';
import { BillingWebhookController } from './billing-webhook.controller';

@Module({})
export class BillingModule {
  static forRoot(options?: any): DynamicModule {
    return {
      module: BillingModule,
      controllers: [BillingController, BillingWebhookController],
      providers: [StripeService, QuotaThrottlerInterceptor],
      exports: [StripeService, QuotaThrottlerInterceptor],
    };
  }
}

export { QuotaThrottlerInterceptor };
export class CustomerSubscriptionDeletedHandler { }
export class VerifyCustomer { }
export class UpdateServiceLevel { }
export class UpdateServiceLevelCommand {
  static create() { return {}; }
}
export class CreateSubscription { }
