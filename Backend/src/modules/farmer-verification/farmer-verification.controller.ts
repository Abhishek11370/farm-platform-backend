import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { FarmerVerificationService } from './farmer-verification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SubmitVerificationDto, ReviewVerificationDto } from './dto/farmer-verification.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('farmer-verification')
export class FarmerVerificationController {
  constructor(private readonly farmerVerificationService: FarmerVerificationService) {}

  /** Farmer: submit KYC document */
  @Roles('FARMER')
  @Post('submit')
  submit(@Request() req: any, @Body() dto: SubmitVerificationDto) {
    return this.farmerVerificationService.submit(req.user.sub, dto);
  }

  /** Farmer: get my verification records */
  @Roles('FARMER')
  @Get('mine')
  findMine(@Request() req: any) {
    return this.farmerVerificationService.findMine(req.user.sub);
  }

  /** Admin: list all verifications */
  @Roles('ADMIN')
  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
  ) {
    return this.farmerVerificationService.findAll(+page, +limit, status);
  }

  /** Admin: get single verification */
  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmerVerificationService.findOne(id);
  }

  /** Admin: approve or reject */
  @Roles('ADMIN')
  @Patch(':id/review')
  review(@Param('id') id: string, @Request() req: any, @Body() dto: ReviewVerificationDto) {
    return this.farmerVerificationService.review(id, req.user.sub, dto);
  }
}
