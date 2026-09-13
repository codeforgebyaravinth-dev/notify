import { EnvironmentWithUserObjectCommand } from '@notify/application-generic';
import { IsDefined, IsString } from 'class-validator';

export class WorkflowTestDataCommand extends EnvironmentWithUserObjectCommand {
  @IsString()
  @IsDefined()
  workflowIdOrInternalId: string;
}
