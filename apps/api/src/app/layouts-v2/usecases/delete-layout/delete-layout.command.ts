import { EnvironmentWithUserCommand } from '@notify/application-generic';
import { IsDefined, IsString } from 'class-validator';

export class DeleteLayoutCommand extends EnvironmentWithUserCommand {
  @IsString()
  @IsDefined()
  layoutIdOrInternalId: string;
}
