import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { RequestUser } from "../../types/request-user";

interface AuthenticatedRequest extends Request {
  user: RequestUser;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('revenue')
  getRevenue(@Query('days') days = '30') {
    return this.analyticsService.getRevenueTimeline(+days);
  }

  @Get('top-products')
  getTopProducts(@Query('limit') limit = '10') {
    return this.analyticsService.getTopProducts(+limit);
  }

  @Get('user-growth')
  getUserGrowth() {
    return this.analyticsService.getUserGrowth();
  }

  @Get('orders')
  getOrderStats() {
    return this.analyticsService.getOrderStats();
  }

  @Get('auctions')
  getAuctionStats() {
    return this.analyticsService.getAuctionStats();
  }

  @Get("farmer")
  @Roles(Role.FARMER)
  async getFarmerAnalytics(@Req() req: AuthenticatedRequest) {
    return this.analyticsService.getFarmerAnalytics(req.user.id);
  }

  @Get('ai-insights')
  getAIInsights() {
    return this.analyticsService.getAIInsights();
  }
}
