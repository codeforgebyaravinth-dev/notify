import { BaseCommand } from '@notify/application-generic';
import { IsDefined, IsString } from 'class-validator';

export class GetSlackSetupLinkStatusCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  token: string;
}
