import { ApiProperty } from '@nestjs/swagger';
import { CustomDataType, ICreateTenantDto } from '@notify/shared';

export class CreateTenantRequestDto implements ICreateTenantDto {
  @ApiProperty()
  identifier: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  data?: CustomDataType;
}
