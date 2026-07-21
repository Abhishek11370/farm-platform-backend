import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}


  @Get()
  @Roles(Role.FARMER)
  async getInventory() { return []; }

  @Post()
  @Roles(Role.FARMER)
  async createInventory(@Body() data: any) { return { success: true }; }

  @Delete(':id')
  @Roles(Role.FARMER)
  async deleteInventory(@Param('id') id: string) { return { success: true }; }

}
