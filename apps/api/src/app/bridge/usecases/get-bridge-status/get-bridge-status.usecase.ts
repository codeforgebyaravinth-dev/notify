import { Injectable } from '@nestjs/common';
import { ExecuteBridgeRequest, ExecuteBridgeRequestCommand, ExecuteBridgeRequestDto } from '@notify/application-generic';
import { GetActionEnum, HealthCheck } from '@notify/framework/internal';
import { ResourceOriginEnum } from '@notify/shared';
import { GetBridgeStatusCommand } from './get-bridge-status.command';

@Injectable()
export class GetBridgeStatus {
  constructor(private executeBridgeRequest: ExecuteBridgeRequest) {}

  async execute(command: GetBridgeStatusCommand): Promise<HealthCheck> {
    return (await this.executeBridgeRequest.execute(
      ExecuteBridgeRequestCommand.create({
        environmentId: command.environmentId,
        action: GetActionEnum.HEALTH_CHECK,
        workflowOrigin: ResourceOriginEnum.EXTERNAL,
        statelessBridgeUrl: command.statelessBridgeUrl,
        retriesLimit: 1,
        enforceSsrfProtection: command.enforceSsrfProtection,
      })
    )) as ExecuteBridgeRequestDto<GetActionEnum.HEALTH_CHECK>;
  }
}
