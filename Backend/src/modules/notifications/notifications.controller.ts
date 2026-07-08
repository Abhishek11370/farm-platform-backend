import {
  Controller, Get, Post, Patch, Delete, Param, Query,
  UseGuards, Request, Body,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { NotificationType } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** Get current user's notifications */
  @Get()
  findMine(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.notificationsService.findMine(req.user.sub, +page, +limit);
  }

  /** Mark a single notification as read */
  @Patch(':id/read')
  markRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markRead(id, req.user.sub);
  }

  /** Mark all notifications as read */
  @Patch('read-all')
  markAllRead(@Request() req: any) {
    return this.notificationsService.markAllRead(req.user.sub);
  }

  /** Delete a notification */
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.remove(id, req.user.sub);
  }

  /** Admin: send notification to a user */
  @Roles('ADMIN')
  @Post('send')
  create(
    @Body('userId') userId: string,
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('type') type: NotificationType,
  ) {
    return this.notificationsService.create(userId, title, message, type);
  }

  /** Admin: list all notifications */
  @Roles('ADMIN')
  @Get('admin/all')
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.notificationsService.findAll(+page, +limit);
  }
}
