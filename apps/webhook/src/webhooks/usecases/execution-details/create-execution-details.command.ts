import { EnvironmentCommand } from '@notify/application-generic';
import { MessageEntity } from '@notify/dal';
import { ChannelTypeEnum } from '@notify/shared';
import { IsDefined } from 'class-validator';
import { IWebhookResult } from '../../dtos/webhooks-response.dto';
import { WebhookTypes } from '../../interfaces/webhook.interface';

export class CreateExecutionDetailsCommand {
  @IsDefined()
  webhook: WebhookCommand;

  @IsDefined()
  message: MessageEntity;

  @IsDefined()
  webhookEvent: IWebhookResult;

  @IsDefined()
  channel: ChannelTypeEnum;
}

export class WebhookCommand extends EnvironmentCommand {
  @IsDefined()
  providerId: string;

  @IsDefined()
  body: any;

  @IsDefined()
  type: WebhookTypes;
}
