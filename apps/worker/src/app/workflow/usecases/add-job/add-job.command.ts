import { EnvironmentWithUserCommand } from '@notify/application-generic';
import { JobEntity, NotificationEntity } from '@notify/dal';
import { StatelessControls } from '@notify/shared';
import { IsDefined } from 'class-validator';

export type PartialNotificationEntity = Pick<
  NotificationEntity,
  | '_id'
  | '_templateId'
  | '_organizationId'
  | '_environmentId'
  | '_subscriberId'
  | 'transactionId'
  | 'channels'
  | 'to'
  | 'payload'
  | 'controls'
  | 'topics'
  | '_digestedNotificationId'
  | 'createdAt'
  | 'severity'
  | 'critical'
  | 'contextKeys'
  | 'tags'
>;

export class AddJobCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  jobId: string;

  @IsDefined()
  job: JobEntity;

  notification?: PartialNotificationEntity | null;

  controls?: StatelessControls;
}
