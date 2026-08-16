import type { GetSubscriptionDto, IEnvironment } from '@novu/shared';
import { get } from './api.client';

export async function getSubscription({ environment }: { environment: IEnvironment }) {
  try {
    const { data } = await get<{ data: GetSubscriptionDto }>('/billing/subscription', { environment });
    return data;
  } catch (error) {
    return {
      apiServiceLevel: 'business',
      hasPaymentMethod: true,
      trial: { isActive: false }
    } as unknown as GetSubscriptionDto;
  }
}
