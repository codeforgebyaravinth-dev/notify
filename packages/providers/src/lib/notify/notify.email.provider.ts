import { EmailProviderIdEnum } from '@novu/shared';
import { ChannelTypeEnum, IEmailOptions, IEmailProvider, ISendMessageSuccessResponse, IEmailEventBody } from '@novu/stateless';
import { SESEmailProvider } from '../email/ses/ses.provider';
import { SESConfig } from '../email/ses/ses.config';
import { WithPassthrough } from '../../utils/types';

/**
 * The Notify Managed Email Provider (1-Click Integration).
 * 
 * This provider acts as a secure, zero-configuration wrapper around the AWS SES provider.
 * Instead of relying on user-provided credentials from the database, it securely pulls
 * master wholesale credentials directly from the server's environment variables.
 * 
 * This ensures that master keys are never exposed to the frontend or stored in tenant records.
 */
export class NotifyEmailProvider implements IEmailProvider {
  id = EmailProviderIdEnum.Notify;
  channelType = ChannelTypeEnum.EMAIL as ChannelTypeEnum.EMAIL;
  private sesProvider: SESEmailProvider;

  constructor() {
    // SECURITY FIX: We do NOT take credentials from the user's DB.
    // We pull the master wholesale keys directly from the server environment.
    // This guarantees the keys are never sent to the frontend UI.
    // Defensive Check: Ensure master keys exist in the environment
    if (!process.env.NOTIFY_AWS_ACCESS_KEY_ID || !process.env.NOTIFY_AWS_SECRET_ACCESS_KEY) {
      throw new Error(
        'CRITICAL: Notify managed email provider is enabled, but NOTIFY_AWS_ACCESS_KEY_ID or NOTIFY_AWS_SECRET_ACCESS_KEY is missing from the environment.'
      );
    }

    const masterConfig = {
      region: process.env.NOTIFY_AWS_REGION || 'us-east-1',
      accessKeyId: process.env.NOTIFY_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NOTIFY_AWS_SECRET_ACCESS_KEY,
      from: process.env.NOTIFY_DEFAULT_FROM_EMAIL || 'no-reply@notify.so',
      senderName: 'Notify',
    };

    // Under the hood, the Notify Managed Email provider uses AWS SES
    this.sesProvider = new SESEmailProvider(masterConfig);
  }

  async sendMessage(
    options: IEmailOptions,
    bridgeProviderData: WithPassthrough<Record<string, unknown>> = {}
  ): Promise<ISendMessageSuccessResponse> {
    return this.sesProvider.sendMessage(options, bridgeProviderData);
  }

  getMessageId(body: unknown | unknown[]): string[] {
    return this.sesProvider.getMessageId(body);
  }

  parseEventBody(body: unknown | unknown[], identifier: string): IEmailEventBody | undefined {
    return this.sesProvider.parseEventBody(body, identifier);
  }

  async checkIntegration() {
    return this.sesProvider.checkIntegration();
  }
}
