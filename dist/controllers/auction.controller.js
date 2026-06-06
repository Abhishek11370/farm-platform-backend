"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionController = void 0;
const auction_service_1 = require("../services/auction.service");
const audit_1 = require("../utils/audit");
const to_string_1 = require("../utils/to-string");
class AuctionController {
    static async listAuctions(req, res, next) {
        try {
            const filters = {
                status: (0, to_string_1.toStringValueOrUndefined)(req.query.status),
                search: (0, to_string_1.toStringValueOrUndefined)(req.query.search),
                page: (0, to_string_1.toStringValueOrUndefined)(req.query.page) ? Number((0, to_string_1.toStringValue)(req.query.page)) : undefined,
                limit: (0, to_string_1.toStringValueOrUndefined)(req.query.limit) ? Number((0, to_string_1.toStringValue)(req.query.limit)) : undefined,
            };
            const result = await auction_service_1.AuctionService.listAuctions(filters);
            res.json({ data: result.auctions, meta: result.pagination, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAuctionById(req, res, next) {
        try {
            const auction = await auction_service_1.AuctionService.getAuctionById((0, to_string_1.toStringValue)(req.params.id));
            res.json({ data: auction, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async createAuction(req, res, next) {
        try {
            const auction = await auction_service_1.AuctionService.createAuction((0, to_string_1.toStringValue)(req.user.id), req.body);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'AUCTION_CREATE',
                entity: 'Auction',
                entityId: auction.id,
                ip: req.ip
            });
            res.status(201).json({ data: auction, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateAuction(req, res, next) {
        try {
            const auction = await auction_service_1.AuctionService.updateAuction((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), req.body);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'AUCTION_UPDATE',
                entity: 'Auction',
                entityId: (0, to_string_1.toStringValue)(req.params.id),
                payload: { status: req.body.status },
                ip: req.ip
            });
            res.json({ data: auction, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async placeBid(req, res, next) {
        try {
            const bid = await auction_service_1.AuctionService.placeBid((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), req.body.amount);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'AUCTION_BID_PLACE',
                entity: 'Bid',
                entityId: bid.id,
                payload: { amount: bid.amount, auctionId: (0, to_string_1.toStringValue)(req.params.id) },
                ip: req.ip
            });
            res.status(201).json({ data: bid, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAuctionBids(req, res, next) {
        try {
            const bids = await auction_service_1.AuctionService.getAuctionBids((0, to_string_1.toStringValue)(req.params.id));
            res.json({ data: bids, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuctionController = AuctionController;
