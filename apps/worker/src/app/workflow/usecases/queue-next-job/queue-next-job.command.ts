import { EnvironmentWithUserCommand } from '@notify/application-generic';
import { IsDefined } from 'class-validator';

export class QueueNextJobCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  parentId: string;

  @IsDefined()
  subscriberId: string;
}
