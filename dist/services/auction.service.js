"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const sockets_1 = require("../sockets");
const client_1 = require("@prisma/client");
class AuctionService {
    static async listAuctions(filters) {
        const { status, search, page = 1, limit = 10 } = filters;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.product = {
                title: { contains: search, mode: 'insensitive' }
            };
        }
        const [auctions, total] = await Promise.all([
            prisma_1.default.auction.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    product: { include: { images: true, unit: true } },
                    bids: { orderBy: { amount: 'desc' }, take: 5, include: { bidder: { select: { id: true, name: true } } } }
                }
            }),
            prisma_1.default.auction.count({ where })
        ]);
        return {
            auctions,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    static async getAuctionById(id) {
        const auction = await prisma_1.default.auction.findUnique({
            where: { id },
            include: {
                product: { include: { images: true, unit: true, grade: true } },
                bids: { orderBy: { amount: 'desc' }, include: { bidder: { select: { id: true, name: true } } } }
            }
        });
        if (!auction)
            throw new Error('Auction not found');
        return auction;
    }
    static async createAuction(userId, data) {
        const { productId, startTime, endTime, basePrice } = data;
        // Check if product exists and belongs to owner
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new Error('Product not found');
        if (product.ownerId !== userId)
            throw new Error('Unauthorized');
        const auction = await prisma_1.default.auction.create({
            data: {
                productId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                basePrice: Number(basePrice),
                status: client_1.AuctionStatus.DRAFT
            },
            include: {
                product: true
            }
        });
        return auction;
    }
    static async updateAuction(auctionId, userId, data) {
        const auction = await prisma_1.default.auction.findUnique({ where: { id: auctionId }, include: { product: true } });
        if (!auction)
            throw new Error('Auction not found');
        if (auction.product.ownerId !== userId)
            throw new Error('Unauthorized');
        const { status, basePrice, startTime, endTime } = data;
        const updated = await prisma_1.default.auction.update({
            where: { id: auctionId },
            data: {
                status: status ? status : undefined,
                basePrice: basePrice ? Number(basePrice) : undefined,
                startTime: startTime ? new Date(startTime) : undefined,
                endTime: endTime ? new Date(endTime) : undefined
            }
        });
        if (status === client_1.AuctionStatus.CLOSED) {
            // Find winning bid
            const winningBid = await prisma_1.default.bid.findFirst({
                where: { auctionId },
                orderBy: { amount: 'desc' },
                include: { bidder: { select: { id: true, name: true } } }
            });
            (0, sockets_1.broadcastAuctionClosed)(auctionId, {
                auctionId,
                winnerId: winningBid?.bidderId,
                winnerName: winningBid?.bidder.name,
                winningAmount: winningBid?.amount,
                status: client_1.AuctionStatus.CLOSED
            });
        }
        return updated;
    }
    static async placeBid(auctionId, bidderId, amount) {
        const auction = await prisma_1.default.auction.findUnique({
            where: { id: auctionId },
            include: { bids: { orderBy: { amount: 'desc' }, take: 1 } }
        });
        if (!auction)
            throw new Error('Auction not found');
        if (auction.status !== client_1.AuctionStatus.LIVE)
            throw new Error('Auction is not live');
        if (new Date() > new Date(auction.endTime))
            throw new Error('Auction has ended');
        const highestBid = auction.bids[0];
        const minBid = highestBid ? highestBid.amount : auction.basePrice;
        if (amount <= minBid) {
            throw new Error(`Bid must be higher than current highest bid of ${minBid}`);
        }
        const bid = await prisma_1.default.bid.create({
            data: {
                auctionId,
                bidderId,
                amount: Number(amount)
            },
            include: { bidder: { select: { id: true, name: true } } }
        });
        // Real-time broadcast using Socket.io helper
        (0, sockets_1.broadcastAuctionBid)(auctionId, {
            id: bid.id,
            auctionId,
            bidderId: bid.bidderId,
            bidderName: bid.bidder.name,
            amount: bid.amount,
            createdAt: bid.createdAt
        });
        return bid;
    }
    static async getAuctionBids(auctionId) {
        return prisma_1.default.bid.findMany({
            where: { auctionId },
            orderBy: { amount: 'desc' },
            include: { bidder: { select: { id: true, name: true } } }
        });
    }
}
exports.AuctionService = AuctionService;
