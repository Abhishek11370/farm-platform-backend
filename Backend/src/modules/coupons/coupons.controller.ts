import { Controller, Get, Post, Delete, Param, Body, Query, Patch, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateCouponDto } from './dto/coupon.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  /** Admin: Create coupon */
  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  /** Admin: list all coupons */
  @Roles('ADMIN')
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    return this.couponsService.findAll(+page, +limit);
  }

  /** Validate a coupon code (any authenticated user) */
  @Post('validate')
  validate(@Body('code') code: string) {
    return this.couponsService.validate(code);
  }

  /** Get coupon by ID */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  /** Admin: toggle active state */
  @Roles('ADMIN')
  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.couponsService.toggleActive(id, isActive);
  }

  /** Admin: delete coupon */
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}
