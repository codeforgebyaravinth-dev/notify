import { CursorBasedPaginatedCommand } from '@notify/application-generic';
import { ChannelEndpointEntity } from '@notify/dal';
import { ChannelTypeEnum, providerIdValues, ProvidersIdEnum } from '@notify/shared';
import { IsArray, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

export class ListChannelEndpointsCommand extends CursorBasedPaginatedCommand<
  ChannelEndpointEntity,
  'createdAt' | 'updatedAt'
> {
  @IsOptional()
  @IsString()
  subscriberId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  contextKeys?: string[];

  @IsEnum(ChannelTypeEnum)
  @IsOptional()
  channel?: ChannelTypeEnum;

  @IsIn(providerIdValues)
  @IsOptional()
  providerId?: ProvidersIdEnum;

  @IsOptional()
  @IsString()
  integrationIdentifier?: string;

  @IsOptional()
  @IsString()
  connectionIdentifier?: string;
}
