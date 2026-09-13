import { BaseCommand } from '@notify/application-generic';
import { OrganizationEntity } from '@notify/dal';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetOrganizationSettingsCommand extends BaseCommand {
  @IsNotEmpty()
  readonly organizationId: string;

  @IsOptional()
  readonly organization?: OrganizationEntity;
}
