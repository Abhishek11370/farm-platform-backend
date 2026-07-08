import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ActivityService } from "./activity.service";
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
@Controller("activity")
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async getUserActivities(@Req() req: AuthenticatedRequest) {
    return this.activityService.getUserActivities(req.user.id);
  }

  @Get("admin")
  @Roles(Role.ADMIN)
  async getAllActivities() {
    return this.activityService.getAllActivities();
  }
}
