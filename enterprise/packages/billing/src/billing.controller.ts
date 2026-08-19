import { Controller, Get, Post, Req, Body, UseGuards, Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { StripeService } from './stripe.service';

import { RequireAuthentication } from '@novu/ee-auth';

@Controller('/billing')
@RequireAuthentication()
export class BillingController {
  constructor(private stripeService: StripeService) {}

  @Get('/subscription')
  async getSubscription(@Req() req: any) {
    const orgId = req.user.organizationId;
    const data = await this.stripeService.getSubscriptionStatus(orgId);
    return { data };
  }

  @Get('/portal')
  async getPortalUrl(@Req() req: any) {
    const orgId = req.user.organizationId;
    const url = await this.stripeService.createPortalSession(orgId);
    return { data: url };
  }

  @Post('/checkout-session')
  async createCheckoutSession(@Req() req: any, @Body() body: { billingInterval: 'month' | 'year'; apiServiceLevel: string }) {
    const orgId = req.user.organizationId;
    const email = req.user.email;
    const url = await this.stripeService.createCheckoutSession(orgId, email, body.billingInterval, body.apiServiceLevel);
    return { data: { url } };
  }
}
