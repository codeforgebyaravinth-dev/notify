import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StripeService } from './stripe.service';

@Injectable()
export class QuotaThrottlerInterceptor implements NestInterceptor {
  static usageCount: Record<string, number> = {};

  constructor(private stripeService: StripeService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    if (request.url.includes('/v1/events/trigger') && request.method === 'POST') {
      const organizationId = request.user?.organizationId;
      if (organizationId) {
        QuotaThrottlerInterceptor.usageCount[organizationId] =
          (QuotaThrottlerInterceptor.usageCount[organizationId] || 0) + 1;
        const subscription = await this.stripeService.getSubscriptionStatus(organizationId);
        const limit = subscription.events?.included || 10000;
        if (QuotaThrottlerInterceptor.usageCount[organizationId] > limit) {
          throw new HttpException(
            {
              message: `Monthly event quota exceeded (${limit}). Please upgrade your plan in the Billing Settings.`,
              error: 'Too Many Requests',
              statusCode: 429,
            },
            HttpStatus.TOO_MANY_REQUESTS
          );
        }
      }
    }
    return next.handle();
  }
}
