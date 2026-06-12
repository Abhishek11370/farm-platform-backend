import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async getUserActivities(@Req() req: any) {
    return this.activityService.getUserActivities(req.user.id);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  async getAllActivities() {
    return this.activityService.getAllActivities();
  }
}
