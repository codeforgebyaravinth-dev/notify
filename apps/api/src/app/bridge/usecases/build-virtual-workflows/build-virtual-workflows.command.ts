import { EnvironmentWithUserCommand } from '@notify/application-generic';
import { DiscoverWorkflowOutput } from '@notify/framework/internal';
import { IsArray, IsDefined } from 'class-validator';

export class BuildVirtualWorkflowsCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  @IsArray()
  discoveredWorkflows: DiscoverWorkflowOutput[];
}
