import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { Request } from "express";
import { RequestUser } from "../../types/request-user";

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async listAddresses(@Req() req: AuthenticatedRequest) {
    return this.addressService.listAddresses(req.user.id);
  }

  @Post()
  async createAddress(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateAddressDto,
  ) {
    return this.addressService.createAddress(req.user.id, dto);
  }

  @Patch(":id")
  async updateAddress(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.addressService.updateAddress(id, req.user.id, dto);
  }

  @Delete(":id")
  async deleteAddress(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.addressService.deleteAddress(id, req.user.id);
  }
}
