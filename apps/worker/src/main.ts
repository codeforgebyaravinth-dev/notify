// Deep-path import (not the package barrel) so hydrating secrets doesn't evaluate
// @notify/application-generic before OTEL instrumentation is installed in ./bootstrap.
import { runWithHydratedSecrets } from '@notify/application-generic/build/main/services/secrets-manager';

void runWithHydratedSecrets(async () => {
  const { bootstrap } = await import('./bootstrap');
  await bootstrap();
});
