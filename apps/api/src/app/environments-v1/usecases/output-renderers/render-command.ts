import { BaseCommand } from '@notify/application-generic';
import { OrganizationEntity } from '@notify/dal';
import type { ContextResolved } from '@notify/framework/internal';
import { LAYOUT_CONTENT_VARIABLE } from '@notify/shared';

export class RenderCommand extends BaseCommand {
  controlValues: Record<string, unknown>;
  fullPayloadForRender: FullPayloadForRender;
  organization?: OrganizationEntity;
}
export class FullPayloadForRender {
  workflow?: Record<string, unknown>;
  subscriber: Record<string, unknown>;
  payload: Record<string, unknown>;
  context?: ContextResolved;
  steps: Record<string, unknown>; // step.stepId.unknown
  /**
   * Environment variables defined in the Novu Dashboard, merged with built-in
   * environment system variables (`name`, `type`). Available in templates as `{{ env.X }}`.
   */
  env?: Record<string, unknown>;
  // this variable is used to pass the layout content to the renderer
  [LAYOUT_CONTENT_VARIABLE]?: string;
}
