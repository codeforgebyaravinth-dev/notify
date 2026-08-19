import { PushProviderIdEnum } from '@novu/shared';
import { ChannelTypeEnum, IPushOptions, IPushProvider, ISendMessageSuccessResponse } from '@novu/stateless';
import { FcmPushProvider } from '../push/fcm/fcm.provider';
import { WithPassthrough } from '../../utils/types';

/**
 * The Notify Managed Push Provider (1-Click Integration).
 * 
 * This provider acts as a secure, zero-configuration wrapper around the Firebase Cloud Messaging (FCM) provider.
 * Instead of relying on user-provided credentials from the database, it securely pulls
 * master wholesale credentials directly from the server's environment variables.
 * 
 * This ensures that master keys are never exposed to the frontend or stored in tenant records.
 */
export class NotifyPushProvider implements IPushProvider {
  id = PushProviderIdEnum.Notify;
  channelType = ChannelTypeEnum.PUSH as ChannelTypeEnum.PUSH;
  private fcmProvider: FcmPushProvider;

  constructor() {
    // Defensive Check: Ensure master keys exist in the environment
    if (!process.env.NOTIFY_FCM_PROJECT_ID || !process.env.NOTIFY_FCM_CLIENT_EMAIL || !process.env.NOTIFY_FCM_PRIVATE_KEY) {
      throw new Error(
        'CRITICAL: Notify managed Push provider is enabled, but FCM environment variables (Project ID, Email, or Private Key) are missing.'
      );
    }

    const masterConfig = {
      projectId: process.env.NOTIFY_FCM_PROJECT_ID,
      email: process.env.NOTIFY_FCM_CLIENT_EMAIL,
      secretKey: process.env.NOTIFY_FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    // Under the hood, the Notify Managed Push provider uses FCM
    this.fcmProvider = new FcmPushProvider(masterConfig);
  }

  async sendMessage(
    options: IPushOptions,
    bridgeProviderData: WithPassthrough<Record<string, unknown>> = {}
  ): Promise<ISendMessageSuccessResponse> {
    return this.fcmProvider.sendMessage(options, bridgeProviderData);
  }

  isTokenInvalid(errorMessage: string): boolean {
    return this.fcmProvider.isTokenInvalid(errorMessage);
  }
}
