import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BEARER_SWAGGER_SECURITY_NAME } from '@notify/application-generic';
import { isEEAuthEnabled } from '@notify/shared';
import { CommunityUserAuthGuard } from './community.user.auth.guard';

export function RequireAuthentication() {
  if (isEEAuthEnabled()) {
    const { RequireAuthentication: EERequireAuthentication } = require('@notify/ee-auth');

    return EERequireAuthentication();
  }

  return applyDecorators(UseGuards(CommunityUserAuthGuard), ApiBearerAuth(BEARER_SWAGGER_SECURITY_NAME));
}
