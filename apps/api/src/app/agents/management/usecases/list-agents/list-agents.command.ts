import { CursorBasedPaginatedCommand } from '@notify/application-generic';
import { AgentEntity } from '@notify/dal';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ListAgentsCommand extends CursorBasedPaginatedCommand<AgentEntity, 'createdAt' | 'updatedAt' | '_id'> {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  environmentId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsOptional()
  identifier?: string;
}
