import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
