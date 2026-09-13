import { ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriberResponseDtoOptional } from '@notify/application-generic';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class LayoutPreviewPayloadDto {
  @ApiPropertyOptional({
    description: 'Partial subscriber information',
    type: SubscriberResponseDtoOptional,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SubscriberResponseDtoOptional)
  subscriber?: SubscriberResponseDtoOptional;
}
