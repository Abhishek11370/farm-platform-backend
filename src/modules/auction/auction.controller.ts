import { Controller, Get, Post, Patch, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PlaceBidDto } from './dto/place-bid.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async listAuctions(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      status,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };
    return this.auctionService.listAuctions(filters);
  }

  @Get(':id')
  async getAuctionById(@Param('id') id: string) {
    return this.auctionService.getAuctionById(id);
  }

  @Post()
  @Roles(Role.FARMER, Role.ADMIN)
  async createAuction(@Req() req: any, @Body() dto: CreateAuctionDto) {
    return this.auctionService.createAuction(req.user.id, dto);
  }

  @Patch(':id')
  @Roles(Role.FARMER, Role.ADMIN)
  async updateAuction(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateAuctionDto) {
    return this.auctionService.updateAuction(id, req.user.id, dto);
  }

  @Post(':id/bid')
  async placeBid(@Param('id') id: string, @Req() req: any, @Body() dto: PlaceBidDto) {
    return this.auctionService.placeBid(id, req.user.id, dto.amount);
  }

  @Get(':id/bids')
  async getAuctionBids(@Param('id') id: string) {
    return this.auctionService.getAuctionBids(id);
  }
}
