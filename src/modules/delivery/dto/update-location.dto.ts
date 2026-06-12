import { IsNumber } from 'class-validator';

export class UpdateDeliveryLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
