import { WorkflowDataContainer } from '@notify/application-generic';
import { UserSessionData } from '@notify/shared';
import { IResourceDiff } from '../../../../types/sync.types';

export interface IBaseComparator<T> {
  compareResources(
    sourceResource: T,
    targetResource: T,
    userContext: UserSessionData,
    workflowDataContainer?: WorkflowDataContainer
  ): Promise<{
    resourceChanges: {
      previous: Record<string, unknown> | null;
      new: Record<string, unknown> | null;
    } | null;
    otherDiffs?: IResourceDiff[];
  }>;
}
