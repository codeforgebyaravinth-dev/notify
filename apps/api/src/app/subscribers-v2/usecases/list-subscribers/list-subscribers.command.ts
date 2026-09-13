import { CursorBasedPaginatedCommand } from '@notify/application-generic';
import { ISubscriber } from '@notify/shared';
import { IsOptional, IsString } from 'class-validator';

export class ListSubscribersCommand extends CursorBasedPaginatedCommand<ISubscriber, 'updatedAt' | '_id'> {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  subscriberId?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
