import { IEventBody } from '@notify/stateless';

export interface IWebhookResult {
  id: string;
  event: IEventBody;
}
