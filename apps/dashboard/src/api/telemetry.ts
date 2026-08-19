import { post } from './api.client';

export const measure = async (event: string, data?: Record<string, unknown>): Promise<void> => {
  // Telemetry is disabled locally, so we silently ignore tracking events
  // to prevent 404 Not Found errors in the console.
  return Promise.resolve();
};

export const identifyTelemetry = async (anonymousId: string): Promise<void> => {
  // Silently ignore
  return Promise.resolve();
};
