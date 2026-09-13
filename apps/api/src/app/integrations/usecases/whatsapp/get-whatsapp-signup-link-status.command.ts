import { BaseCommand } from '@notify/application-generic';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetWhatsAppSignupLinkStatusCommand extends BaseCommand {
  @IsString()
  @IsNotEmpty()
  token: string;
}
