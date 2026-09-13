import { BaseCommand } from '@notify/application-generic';
import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteWhatsAppSignupLinkCommand extends BaseCommand {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  wabaId: string;

  @IsString()
  @IsNotEmpty()
  phoneNumberId: string;
}
