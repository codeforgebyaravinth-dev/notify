import type { NewDashboardOptInStatusEnum } from '@notify/shared';

declare global {
  interface UserUnsafeMetadata {
    dismissed_changelogs?: string[];
    newDashboardFirstVisit?: boolean;
    hideGettingStarted?: boolean;
    workflowChecklistClosed?: boolean;
    workflowChecklistCompleted?: boolean;
    newDashboardOptInStatus?: NewDashboardOptInStatusEnum;
  }
}
