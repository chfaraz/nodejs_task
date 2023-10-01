import { IsEnum, IsString } from 'class-validator';
import { Side } from '../../../config/enum/side.enum';

export class CreateOrderDto {
  @IsEnum(Side)
  side: Side;

  @IsString()
  price: string;
}
