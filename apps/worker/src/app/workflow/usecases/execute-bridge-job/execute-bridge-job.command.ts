import { EnvironmentWithUserCommand, ICompileContext } from '@notify/application-generic';

import { JobEntity, NotificationTemplateEntity } from '@notify/dal';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class ExecuteBridgeJobCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  @IsString()
  environmentId: string;

  @IsDefined()
  @IsString()
  organizationId: string;

  @IsDefined()
  @IsString()
  userId: string;

  @IsDefined()
  @IsString()
  identifier: string;

  @IsDefined()
  jobId: string;

  @IsDefined()
  job: JobEntity;

  @IsDefined()
  variables?: Partial<ICompileContext>;

  @IsOptional()
  workflow?: NotificationTemplateEntity;
}
