import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DeliveryService } from "./delivery.service";
import { AssignDeliveryDto } from "./dto/assign-delivery.dto";
import { UpdateDeliveryStatusDto } from "./dto/update-status.dto";
import { UpdateDeliveryLocationDto } from "./dto/update-location.dto";
import { DeliveryQueryDto } from "./dto/delivery-query.dto";
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
@Controller("delivery")
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @Roles(Role.ADMIN, Role.DELIVERY)
  async listDeliveries(
    @Req() req: AuthenticatedRequest,
    @Query() query: DeliveryQueryDto,
  ) {
    return this.deliveryService.listDeliveries(
      req.user.id,
      req.user.role,
      query,
    );
  }

  @Post("assign")
  @Roles(Role.ADMIN)
  async assignDelivery(@Body() dto: AssignDeliveryDto) {
    return this.deliveryService.assignDelivery(
      dto.orderId,
      dto.agentId,
      dto.pickupAddr,
    );
  }

  @Patch(":id/status")
  @Roles(Role.DELIVERY)
  async updateDeliveryStatus(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateDeliveryStatusDto,
  ) {
    return this.deliveryService.updateDeliveryStatus(
      id,
      dto.status,
      req.user.id,
    );
  }

  @Patch(":id/location")
  @Roles(Role.DELIVERY)
  async updateDeliveryLocation(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateDeliveryLocationDto,
  ) {
    return this.deliveryService.updateDeliveryLocation(
      id,
      dto.latitude,
      dto.longitude,
      req.user.id,
    );
  }

  @Get("earnings")
  @Roles(Role.DELIVERY)
  async getEarnings(@Req() req: AuthenticatedRequest) {
    return this.deliveryService.getEarnings(req.user.id);
  }

  @Get("admin-earnings")
  @Roles(Role.ADMIN)
  async getAdminEarnings() {
    return this.deliveryService.getAdminEarnings();
  }
}
