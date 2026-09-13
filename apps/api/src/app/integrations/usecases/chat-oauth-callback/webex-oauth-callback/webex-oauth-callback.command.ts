import { BaseCommand } from '@notify/application-generic';
import { IsNotEmpty, IsString } from 'class-validator';

export class WebexOauthCallbackCommand extends BaseCommand {
  @IsNotEmpty()
  @IsString()
  readonly providerCode: string;

  @IsNotEmpty()
  @IsString()
  readonly state: string;
}
