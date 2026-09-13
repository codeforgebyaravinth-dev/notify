import { CursorBasedPaginatedCommand } from '@notify/application-generic';
import { DomainRouteEntity } from '@notify/dal';
import { IsOptional, IsString } from 'class-validator';

export class ListDomainRoutesCommand extends CursorBasedPaginatedCommand<DomainRouteEntity, 'updatedAt' | '_id'> {
  @IsString()
  @IsOptional()
  domain?: string;

  @IsString()
  @IsOptional()
  agentId?: string;
}
