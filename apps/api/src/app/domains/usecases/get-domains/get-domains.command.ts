import { CursorBasedPaginatedCommand } from '@notify/application-generic';
import { DomainEntity } from '@notify/dal';
import { IsOptional, IsString } from 'class-validator';

export class GetDomainsCommand extends CursorBasedPaginatedCommand<DomainEntity, 'updatedAt' | '_id'> {
  @IsString()
  @IsOptional()
  name?: string;
}
