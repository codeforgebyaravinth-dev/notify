import { BaseCommand } from '@notify/application-generic';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetTelegramMobileLinkStatusCommand extends BaseCommand {
  @IsString()
  @IsNotEmpty()
  token: string;
}
