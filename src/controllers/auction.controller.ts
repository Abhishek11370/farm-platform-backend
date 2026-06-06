import { Request, Response, NextFunction } from 'express';
import { AuctionService } from '../services/auction.service';
import { logAudit } from '../utils/audit';
import { toStringValue, toStringValueOrUndefined } from '../utils/to-string';

export class AuctionController {
  static async listAuctions(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: toStringValueOrUndefined(req.query.status),
        search: toStringValueOrUndefined(req.query.search),
        page: toStringValueOrUndefined(req.query.page) ? Number(toStringValue(req.query.page)) : undefined,
        limit: toStringValueOrUndefined(req.query.limit) ? Number(toStringValue(req.query.limit)) : undefined,
      };
      const result = await AuctionService.listAuctions(filters);
      res.json({ data: result.auctions, meta: result.pagination, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getAuctionById(req: Request, res: Response, next: NextFunction) {
    try {
      const auction = await AuctionService.getAuctionById(toStringValue(req.params.id));
      res.json({ data: auction, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async createAuction(req: Request, res: Response, next: NextFunction) {
    try {
      const auction = await AuctionService.createAuction(toStringValue(req.user!.id), req.body);
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'AUCTION_CREATE',
        entity: 'Auction',
        entityId: auction.id,
        ip: req.ip
      });
      res.status(201).json({ data: auction, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async updateAuction(req: Request, res: Response, next: NextFunction) {
    try {
      const auction = await AuctionService.updateAuction(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        req.body
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'AUCTION_UPDATE',
        entity: 'Auction',
        entityId: toStringValue(req.params.id),
        payload: { status: req.body.status },
        ip: req.ip
      });
      res.json({ data: auction, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async placeBid(req: Request, res: Response, next: NextFunction) {
    try {
      const bid = await AuctionService.placeBid(
        toStringValue(req.params.id),
        toStringValue(req.user!.id),
        req.body.amount
      );
      await logAudit({
        userId: toStringValue(req.user!.id),
        action: 'AUCTION_BID_PLACE',
        entity: 'Bid',
        entityId: bid.id,
        payload: { amount: bid.amount, auctionId: toStringValue(req.params.id) },
        ip: req.ip
      });
      res.status(201).json({ data: bid, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getAuctionBids(req: Request, res: Response, next: NextFunction) {
    try {
      const bids = await AuctionService.getAuctionBids(toStringValue(req.params.id));
      res.json({ data: bids, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
