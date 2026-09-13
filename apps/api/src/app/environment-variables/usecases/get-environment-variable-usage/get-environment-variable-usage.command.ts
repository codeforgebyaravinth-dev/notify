import { OrganizationLevelWithUserCommand } from '@notify/application-generic';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetEnvironmentVariableUsageCommand extends OrganizationLevelWithUserCommand {
  @IsString()
  @IsNotEmpty()
  variableKey: string;
}
