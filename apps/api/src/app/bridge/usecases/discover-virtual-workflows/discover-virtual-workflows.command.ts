import { EnvironmentWithUserCommand } from '@notify/application-generic';
import { IsDefined, IsString } from 'class-validator';

export class DiscoverVirtualWorkflowsCommand extends EnvironmentWithUserCommand {
  @IsDefined()
  @IsString()
  bridgeUrl: string;
}
