import { CursorBasedPaginatedCommand } from '@notify/application-generic';
import { TopicEntity } from '@notify/dal';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ListTopicsCommand extends CursorBasedPaginatedCommand<TopicEntity, 'createdAt' | 'updatedAt' | '_id'> {
  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  environmentId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  organizationId: string;
}
