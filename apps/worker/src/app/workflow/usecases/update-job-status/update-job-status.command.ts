import { EnvironmentLevelCommand } from '@notify/application-generic';
import { JobStatusEnum } from '@notify/dal';
import { IsDefined, IsOptional } from 'class-validator';

export class UpdateJobStatusCommand extends EnvironmentLevelCommand {
  @IsDefined()
  jobId: string;

  @IsDefined()
  status: JobStatusEnum;

  @IsOptional()
  error?: any;
}
