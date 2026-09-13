import { serve } from '@notify/framework/next';
import { supportAgent } from '../../novu/agents';

export const { GET, POST, OPTIONS } = serve({
  agents: [supportAgent],
});
