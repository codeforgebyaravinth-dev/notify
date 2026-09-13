import { EnvironmentWithUserCommand } from '@notify/application-generic';

export class StoreControlValuesCommand extends EnvironmentWithUserCommand {
  stepId: string;
  workflowId: string;
  controlValues: Record<string, unknown>;
}
