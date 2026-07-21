import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}


  @Get()
  async getShipments() { return []; }
  
  @Get('order/:orderId')
  async getOrderShipments(@Param('orderId') orderId: string) { return []; }

  @Post()
  async createShipment(@Body() data: any) { return { success: true }; }

  @Put(':id')
  async updateShipment(@Param('id') id: string, @Body() data: any) { return { success: true }; }

}
