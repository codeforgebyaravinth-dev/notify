import { Injectable } from '@nestjs/common';
import { GetDecryptedIntegrations, GetDecryptedIntegrationsCommand } from '@notify/application-generic';
import { IntegrationEntity } from '@notify/dal';

import { GetIntegrationsCommand } from './get-integrations.command';

@Injectable()
export class GetIntegrations {
  constructor(private getDecryptedIntegrationsUsecase: GetDecryptedIntegrations) {}

  async execute(command: GetIntegrationsCommand): Promise<IntegrationEntity[]> {
    return await this.getDecryptedIntegrationsUsecase.execute(
      GetDecryptedIntegrationsCommand.create({
        organizationId: command.organizationId,
        userId: command.userId,
        environmentId: command.environmentId,
        returnCredentials: command.returnCredentials,
        scopeToEnvironment: command.scopeToEnvironment,
      })
    );
  }
}
