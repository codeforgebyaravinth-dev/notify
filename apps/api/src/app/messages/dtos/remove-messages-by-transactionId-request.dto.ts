import { ApiPropertyOptional } from '@nestjs/swagger';
import { ChannelTypeEnum } from '@notify/shared';
import { IsEnum, IsOptional } from 'class-validator';

export class DeleteMessageByTransactionIdRequestDto {
  @ApiPropertyOptional({
    enum: ChannelTypeEnum,
    description: 'The channel of the message to be deleted',
  })
  @IsOptional()
  @IsEnum(ChannelTypeEnum)
  channel?: ChannelTypeEnum;
}
