import { EnvironmentCommand } from '@notify/application-generic';
import { IsDefined } from 'class-validator';

export class ProcessUnsnoozeJobCommand extends EnvironmentCommand {
  @IsDefined()
  jobId: string;
}
