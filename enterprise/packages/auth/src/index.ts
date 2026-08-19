import { MiddlewareConsumer, ModuleMetadata } from '@nestjs/common';
import { ClerkAuthGuard } from './clerk-auth.guard';
import { BetterAuthGuard } from './better-auth.guard';
import { RequireAuthentication } from './auth.decorator';
import { BetterAuthController } from './better-auth.controller';

export const eeAuthModule: ModuleMetadata = {
  imports: [],
  controllers: [BetterAuthController],
  providers: [ClerkAuthGuard, BetterAuthGuard],
  exports: [ClerkAuthGuard, BetterAuthGuard],
};

export const configure = (consumer: MiddlewareConsumer) => {};
export { RequireAuthentication };
