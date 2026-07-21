import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Get('cms/pages')
  @Roles(Role.ADMIN)
  async getCmsPages() { return []; }

  @Get('logs')
  @Roles(Role.ADMIN)
  async getLogs() { return []; }

  @Get('notifications')
  @Roles(Role.ADMIN)
  async getNotifications() { return []; }

  @Get('settings')
  @Roles(Role.ADMIN)
  async getSettings() { return {}; }

  @Get('tickets')
  @Roles(Role.ADMIN)
  async getTickets() { return []; }

  @Get('users')
  @Roles(Role.ADMIN)
  async getUsers() { return []; }
  
  @Put(':path')
  @Roles(Role.ADMIN)
  async putAdminPath(@Param('path') path: string, @Body() data: any) { return { success: true }; }

}
