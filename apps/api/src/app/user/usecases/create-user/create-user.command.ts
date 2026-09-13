import { BaseCommand } from '@notify/application-generic';
import { AuthProviderEnum } from '@notify/shared';

export class CreateUserCommand extends BaseCommand {
  email: string;

  firstName?: string | null;

  lastName?: string | null;

  picture?: string;

  auth: {
    username?: string;
    profileId: string;
    provider: AuthProviderEnum;
    accessToken: string;
    refreshToken: string;
  };
}
