import { IntegrationRepository } from '@notify/dal';
import { ChannelTypeEnum, ToolProviderIdEnum } from '@notify/shared';
import { UserSession } from '@notify/testing';

const integrationRepository = new IntegrationRepository();

export const VALID_PAGERDUTY_ROUTING_KEY = 'R0UTINGK3YEXAMPLE000000000000000';

export async function createPagerDutyIntegration(session: UserSession) {
  return integrationRepository.create({
    _organizationId: session.organization._id,
    _environmentId: session.environment._id,
    providerId: ToolProviderIdEnum.PagerDuty,
    channel: ChannelTypeEnum.TOOL,
    credentials: {},
    active: true,
    identifier: `pagerduty-${Date.now()}`,
  });
}
