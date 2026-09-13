import { EnvironmentWithUserCommand } from '@notify/application-generic';
import { IsDefined } from 'class-validator';

export class RunJobCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  jobId: string;
}
