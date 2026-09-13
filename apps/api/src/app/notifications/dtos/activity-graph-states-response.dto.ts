import { ApiProperty } from '@nestjs/swagger';
import { ChannelTypeEnum } from '@notify/shared';

export class ActivityGraphStatesResponse {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  templates: string[];

  @ApiProperty({
    enum: ChannelTypeEnum,
    isArray: true,
  })
  channels: ChannelTypeEnum[];
}
