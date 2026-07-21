import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuctionService } from "./auction.service";
import { CreateAuctionDto } from "./dto/create-auction.dto";
import { UpdateAuctionDto } from "./dto/update-auction.dto";
import { PlaceBidDto } from "./dto/place-bid.dto";
import { AuctionQueryDto } from "./dto/auction-query.dto";
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
@Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
@Controller("auction")
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async listAuctions(@Query() query: AuctionQueryDto) {
    return this.auctionService.listAuctions(query);
  }

  @Get(":id")
  async getAuctionById(@Param("id") id: string) {
    return this.auctionService.getAuctionById(id);
  }

  @Post()
  @Roles(Role.FARMER, Role.ADMIN)
  async createAuction(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateAuctionDto,
  ) {
    return this.auctionService.createAuction(req.user.id, dto);
  }

  @Patch(":id")
  @Roles(Role.FARMER, Role.ADMIN)
  async updateAuction(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateAuctionDto,
  ) {
    return this.auctionService.updateAuction(id, req.user.id, dto);
  }

  @Post(":id/bid")
  async placeBid(
    @Param("id") id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: PlaceBidDto,
  ) {
    return this.auctionService.placeBid(id, req.user.id, dto.amount);
  }

  @Get(":id/bids")
  async getAuctionBids(@Param("id") id: string) {
    return this.auctionService.getAuctionBids(id);
  }

  @Get("farmer")
  @Roles(Role.FARMER)
  async getFarmerAuctions(@Req() req: AuthenticatedRequest) {
    return this.auctionService.getFarmerAuctions(req.user.id);
  }

  @Post(":id/accept")
  @Roles(Role.FARMER)
  async acceptBid(@Param("id") id: string, @Req() req: AuthenticatedRequest, @Body() dto: any) {
    return this.auctionService.acceptBid(id, req.user.id, dto);
  }

}
