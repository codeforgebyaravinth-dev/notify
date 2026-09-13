import { BaseCommand } from '@notify/application-generic';
import { IsDefined } from 'class-validator';

export class ProcessVercelWebhookCommand extends BaseCommand {
  @IsDefined()
  signatureHeader: string;

  @IsDefined()
  body: any;
}
