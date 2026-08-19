import { Controller, Post, Req, Headers, BadRequestException, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('/billing/webhook')
export class BillingWebhookController {
  private logger = new Logger(BillingWebhookController.name);

  constructor(private stripeService: StripeService) {}

  @Post()
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    if (!req.rawBody) {
      this.logger.error('Missing raw body in webhook request');
      throw new BadRequestException('Missing raw body');
    }
    
    if (!signature) {
      this.logger.error('Missing stripe-signature header in webhook request');
      throw new BadRequestException('Missing signature');
    }

    return this.stripeService.handleWebhook(req.rawBody, signature);
  }
}
