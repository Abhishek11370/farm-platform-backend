import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateDeliveryStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
