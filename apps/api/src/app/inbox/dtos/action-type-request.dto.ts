import { ButtonTypeEnum } from '@notify/shared';
import { IsDefined, IsEnum } from 'class-validator';

export class ActionTypeRequestDto {
  @IsEnum(ButtonTypeEnum)
  @IsDefined()
  readonly actionType: ButtonTypeEnum;
}
