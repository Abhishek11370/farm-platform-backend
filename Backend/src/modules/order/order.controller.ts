import { Request } from 'express';
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

import { RequestUser } from '../../types/request-user';
interface AuthenticatedRequest extends Request { user: RequestUser; }
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
  @ApiOperation({ summary: 'Get orders for current user' })
  async findByUser(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.orderService.findByUser(userId);
  }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Get all platform orders' })
  async findAllAdmin() {
    return this.orderService.findAllAdmin();
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

  @Get("farmer")
  @Roles(Role.FARMER)
  async getFarmerOrders(@Req() req: AuthenticatedRequest, @Query() query: any) {
    return this.orderService.getFarmerOrders(req.user.id, query);
  }

  @Get("farmer/stats")
  @Roles(Role.FARMER)
  async getFarmerOrderStats(@Req() req: AuthenticatedRequest) {
    return this.orderService.getFarmerOrderStats(req.user.id);
  }

  @Patch(":id")
  @Roles(Role.FARMER, Role.BUYER, Role.ADMIN)
  async updateOrderDetails(@Param("id") id: string, @Req() req: AuthenticatedRequest, @Body() dto: any) {
    return this.orderService.updateOrderDetails(id, req.user.id, dto);
  }

}
