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
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { Request } from "express";

@ApiTags("orders")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(Role.BUYER, Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new order" })
  @ApiResponse({ status: 201, description: "Order created successfully." })
  async create(@Body() dto: CreateOrderDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.orderService.create({ ...dto, userId });
  }

  @Get()
  @Roles(Role.BUYER, Role.ADMIN)
  @ApiOperation({ summary: "Get orders for current user" })
  async findByUser(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.orderService.findByUser(userId);
  }

  @Get(":id")
  @Roles(Role.BUYER, Role.ADMIN)
  @ApiOperation({ summary: "Get order by ID" })
  async findOne(@Param("id") id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(":id/status")
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: "Update order status" })
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

  @Delete(":id")
  @Roles(Role.BUYER, Role.ADMIN)
  @ApiOperation({ summary: "Cancel/delete an order" })
  async remove(@Param("id") id: string) {
    return this.orderService.remove(id);
  }
}
