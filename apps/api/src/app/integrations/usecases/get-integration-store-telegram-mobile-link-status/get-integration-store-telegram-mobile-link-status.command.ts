import { BaseCommand } from '@notify/application-generic';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetIntegrationStoreTelegramMobileLinkStatusCommand extends BaseCommand {
  @IsString()
  @IsNotEmpty()
  token: string;
}
