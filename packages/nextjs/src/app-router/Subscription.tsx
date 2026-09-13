'use client';

import { Subscription as RSubscription, type SubscriptionProps } from '@notify/react';

export function Subscription(props: SubscriptionProps) {
  return <RSubscription {...props} />;
}
