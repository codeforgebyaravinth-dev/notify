import { SmsProviderIdEnum } from '@novu/shared';
import { ChannelTypeEnum, ISmsOptions, ISmsProvider, ISendMessageSuccessResponse, ISMSEventBody } from '@novu/stateless';
import { TelnyxSmsProvider } from '../sms/telnyx/telnyx.provider';
import { WithPassthrough } from '../../utils/types';

/**
 * The Notify Managed SMS Provider (1-Click Integration).
 * 
 * This provider acts as a secure, zero-configuration wrapper around the Telnyx SMS provider.
 * Instead of relying on user-provided credentials from the database, it securely pulls
 * master wholesale credentials directly from the server's environment variables.
 * 
 * This ensures that master keys are never exposed to the frontend or stored in tenant records.
 */
export class NotifySmsProvider implements ISmsProvider {
  id = SmsProviderIdEnum.Notify;
  channelType = ChannelTypeEnum.SMS as ChannelTypeEnum.SMS;
  private telnyxProvider: TelnyxSmsProvider;

  constructor() {
    // Defensive Check: Ensure master keys exist in the environment
    if (!process.env.NOTIFY_TELNYX_API_KEY) {
      throw new Error(
        'CRITICAL: Notify managed SMS provider is enabled, but NOTIFY_TELNYX_API_KEY is missing from the environment.'
      );
    }

    const masterConfig = {
      apiKey: process.env.NOTIFY_TELNYX_API_KEY,
      from: process.env.NOTIFY_TELNYX_FROM_NUMBER || '+10000000000', // Default fallback for development
      messageProfileId: process.env.NOTIFY_TELNYX_MESSAGE_PROFILE_ID || '',
    };

    // Under the hood, the Notify Managed SMS provider uses Telnyx
    this.telnyxProvider = new TelnyxSmsProvider(masterConfig);
  }

  async sendMessage(
    options: ISmsOptions,
    bridgeProviderData: WithPassthrough<Record<string, unknown>> = {}
  ): Promise<ISendMessageSuccessResponse> {
    return this.telnyxProvider.sendMessage(options, bridgeProviderData);
  }

  getMessageId(body: unknown | unknown[]): string[] {
    return this.telnyxProvider.getMessageId(body);
  }

  parseEventBody(body: unknown | unknown[], identifier: string): ISMSEventBody | undefined {
    return this.telnyxProvider.parseEventBody(body, identifier);
  }
}
