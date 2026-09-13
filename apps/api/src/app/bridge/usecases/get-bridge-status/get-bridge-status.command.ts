import { EnvironmentLevelCommand } from '@notify/application-generic';

export class GetBridgeStatusCommand extends EnvironmentLevelCommand {
  statelessBridgeUrl?: string;

  enforceSsrfProtection?: boolean;
}
