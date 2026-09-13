import { Injectable } from '@nestjs/common';
import { GetWorkflowWithPreferencesCommand, GetWorkflowWithPreferencesUseCase } from '@notify/application-generic';
import { NotificationTemplateEntity } from '@notify/dal';
import { GetNotificationTemplateCommand } from './get-notification-template.command';

/**
 * @deprecated
 * This usecase is deprecated and will be removed in the future.
 * Please use the GetWorkflow usecase instead.
 */
@Injectable()
export class GetNotificationTemplate {
  constructor(private getWorkflowWithPreferencesUseCase: GetWorkflowWithPreferencesUseCase) {}

  async execute(command: GetNotificationTemplateCommand): Promise<NotificationTemplateEntity> {
    const workflow = await this.getWorkflowWithPreferencesUseCase.execute(
      GetWorkflowWithPreferencesCommand.create({
        workflowIdOrInternalId: command.workflowIdOrIdentifier,
        environmentId: command.environmentId,
        organizationId: command.organizationId,
      })
    );

    return workflow;
  }
}
