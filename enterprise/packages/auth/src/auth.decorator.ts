import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { BetterAuthGuard } from './better-auth.guard';

export function RequireAuthentication() {
  const Guard = process.env.AUTH_PROVIDER === 'better-auth' ? BetterAuthGuard : ClerkAuthGuard;
  return applyDecorators(UseGuards(Guard), ApiBearerAuth('bearer'));
}
