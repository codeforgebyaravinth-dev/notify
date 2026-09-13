import { ServiceUnavailableException } from '@nestjs/common';
import { FeatureFlagsService } from '@notify/application-generic';
import { FeatureFlagsKeysEnum } from '@notify/shared';

export async function assertGetPreferencesEnabled(
  featureFlagsService: FeatureFlagsService,
  organizationId: string,
  environmentId: string
): Promise<void> {
  const isGetPreferencesDisabled = await featureFlagsService.getFlag({
    key: FeatureFlagsKeysEnum.IS_GET_PREFERENCES_DISABLED,
    defaultValue: false,
    organization: { _id: organizationId },
    environment: { _id: environmentId },
  });

  if (isGetPreferencesDisabled) {
    throw new ServiceUnavailableException('Get preferences service is currently unavailable');
  }
}
