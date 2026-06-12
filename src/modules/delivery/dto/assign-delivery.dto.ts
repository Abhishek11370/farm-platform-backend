import { IsString, IsNotEmpty } from 'class-validator';

export class AssignDeliveryDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  pickupAddr: string;
}
