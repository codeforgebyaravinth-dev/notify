import { Novu } from './novu';
import type { NovuOptions, Notification, ListNotificationsResponse, UnreadCount } from './types';

let notifyInstance: Novu | null = null;

/**
 * Initializes the global Notify instance, Firebase-style.
 * @param options Initialization options containing applicationIdentifier, subscriberId, etc.
 * @returns The initialized Novu client instance
 */
export function initializeNotify(options: NovuOptions): Novu {
  if (!notifyInstance) {
    notifyInstance = new Novu(options);
  } else {
    console.warn('Notify is already initialized. Returning existing instance.');
  }
  return notifyInstance;
}

/**
 * Gets the global Notify instance. Throws if not initialized.
 */
export function getNotify(): Novu {
  if (!notifyInstance) {
    throw new Error('Notify has not been initialized. Call initializeNotify() first.');
  }
  return notifyInstance;
}

// Helper exports for tree-shakeable API

export async function getNotifications(options: any = {}) {
  const instance = getNotify();
  return instance.notifications.list(options);
}

export async function getUnreadCount(options: any = {}) {
  const instance = getNotify();
  return instance.notifications.count({ read: false, ...options });
}

export function onNotification(callback: (notification: Notification) => void): () => void {
  const instance = getNotify();
  const handler = (data: any) => callback(data as Notification);
  instance.on('notifications.notification_received', handler);
  
  // Return an unsubscribe function
  return () => {
    instance.off('notifications.notification_received', handler);
  };
}
