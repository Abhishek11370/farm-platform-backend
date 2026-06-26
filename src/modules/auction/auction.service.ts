import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuctionStatus, Prisma } from '@prisma/client';
import { broadcastAuctionBid, broadcastAuctionClosed } from '../../sockets';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { AuctionQueryDto } from './dto/auction-query.dto';

@Injectable()
export class AuctionService {
  constructor(private readonly prisma: PrismaService) {}

  private get baseSelect() {
    return {
      id: true,
      productId: true,
      startTime: true,
      endTime: true,
      basePrice: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      product: {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          quantity: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
          ownerId: true,
          unit: { select: { id: true, name: true } },
          grade: { select: { id: true, name: true } },
          images: { select: { id: true, imageUrl: true, isPrimary: true } }
        }
      },
      bids: {
        orderBy: { amount: 'desc' as const },
        take: 5,
        select: {
          id: true,
          auctionId: true,
          bidderId: true,
          amount: true,
          createdAt: true,
          bidder: { select: { id: true, name: true, phone: true, email: true } },
        },
      },
    };
  }

  async listAuctions(filters: AuctionQueryDto) {
    const { status, search, page = 1, limit = 10 } = filters;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Prisma.AuctionWhereInput = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.product = {
        title: { contains: search, mode: 'insensitive' },
      };
    }

    const [auctions, total] = await Promise.all([
      this.prisma.auction.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        select: this.baseSelect,
      }),
      this.prisma.auction.count({ where }),
    ]);

    return {
      auctions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getAuctionById(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      select: {
        ...this.baseSelect,
        bids: {
          orderBy: { amount: 'desc' as const },
          select: {
            id: true,
            auctionId: true,
            bidderId: true,
            amount: true,
            createdAt: true,
            bidder: { select: { id: true, name: true, phone: true, email: true } },
          },
        },
      },
    });
    if (!auction) throw new NotFoundException('Auction not found');
    return auction;
  }

  async createAuction(userId: string, dto: CreateAuctionDto) {
    const { productId, startTime, endTime, basePrice } = dto;

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.ownerId !== userId) throw new UnauthorizedException('Unauthorized');

    const created = await this.prisma.auction.create({
      data: {
        productId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        basePrice: Number(basePrice),
        status: AuctionStatus.DRAFT,
      },
      select: {
        id: true,
        productId: true,
        startTime: true,
        endTime: true,
        basePrice: true,
        status: true,
        createdAt: true,
        product: { select: { id: true, title: true, ownerId: true } }
      }
    });

    return created;
  }

  async updateAuction(auctionId: string, userId: string, dto: UpdateAuctionDto) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      select: { product: { select: { ownerId: true } } },
    });
    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.product.ownerId !== userId) throw new UnauthorizedException('Unauthorized');

    const { status, basePrice, startTime, endTime } = dto;

    const updated = await this.prisma.auction.update({
      where: { id: auctionId },
      data: {
        status: status ? (status as AuctionStatus) : undefined,
        basePrice: basePrice ? Number(basePrice) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
      },
      select: {
        id: true,
        productId: true,
        startTime: true,
        endTime: true,
        basePrice: true,
        status: true,
      }
    });

    if (status === AuctionStatus.CLOSED) {
      const winningBid = await this.prisma.bid.findFirst({
        where: { auctionId },
        orderBy: { amount: 'desc' },
        select: {
          amount: true,
          bidderId: true,
          bidder: { select: { id: true, name: true } },
        },
      });
      broadcastAuctionClosed(auctionId, {
        auctionId,
        winnerId: winningBid?.bidderId,
        winnerName: winningBid?.bidder.name,
        winningAmount: winningBid?.amount,
        status: AuctionStatus.CLOSED,
      });
    }

    return updated;
  }

  async placeBid(auctionId: string, bidderId: string, amount: number) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: auctionId },
      select: {
        status: true,
        endTime: true,
        basePrice: true,
        bids: { orderBy: { amount: 'desc' }, take: 1, select: { amount: true } }
      },
    });

    if (!auction) throw new NotFoundException('Auction not found');
    if (auction.status !== AuctionStatus.LIVE) throw new BadRequestException('Auction is not live');
    if (new Date() > new Date(auction.endTime)) throw new BadRequestException('Auction has ended');

    const highestBid = auction.bids[0];
    const minBid = highestBid ? highestBid.amount : auction.basePrice;

    if (amount <= minBid) {
      throw new BadRequestException(`Bid must be higher than current highest bid of ${minBid}`);
    }

    const bid = await this.prisma.bid.create({
      data: {
        auctionId,
        bidderId,
        amount: Number(amount),
      },
      select: {
        id: true,
        auctionId: true,
        bidderId: true,
        amount: true,
        createdAt: true,
        bidder: { select: { id: true, name: true } },
      },
    });

    broadcastAuctionBid(auctionId, {
      id: bid.id,
      auctionId,
      bidderId: bid.bidderId,
      bidderName: bid.bidder.name,
      amount: bid.amount,
      createdAt: bid.createdAt,
    });

    return bid;
  }

  async getAuctionBids(auctionId: string) {
    return this.prisma.bid.findMany({
      where: { auctionId },
      orderBy: { amount: 'desc' },
      select: {
        id: true,
        auctionId: true,
        bidderId: true,
        amount: true,
        createdAt: true,
        bidder: { select: { id: true, name: true } },
      },
    });
  }
}
