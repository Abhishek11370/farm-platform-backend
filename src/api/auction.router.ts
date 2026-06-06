import { Router } from 'express';
import { z } from 'zod';
import { AuctionController } from '../controllers/auction.controller';
import { validate } from '../middlewares/validate';
import { auth, allow } from '../middlewares/auth';
import { Role, AuctionStatus } from '@prisma/client';

const router = Router();

const auctionCreateSchema = z.object({
  body: z.object({
    productId: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    basePrice: z.number().positive()
  })
});

const auctionUpdateSchema = z.object({
  body: z.object({
    status: z.nativeEnum(AuctionStatus).optional(),
    basePrice: z.number().positive().optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional()
  })
});

const bidSchema = z.object({
  body: z.object({
    amount: z.number().positive()
  })
});

router.get('/', auth, AuctionController.listAuctions);
router.get('/:id', auth, AuctionController.getAuctionById);
router.post('/', auth, allow(Role.FARMER, Role.ADMIN), validate(auctionCreateSchema), AuctionController.createAuction);
router.put('/:id', auth, allow(Role.FARMER, Role.ADMIN), validate(auctionUpdateSchema), AuctionController.updateAuction);

router.post('/:id/bid', auth, allow(Role.BUYER), validate(bidSchema), AuctionController.placeBid);
router.get('/:id/bids', auth, AuctionController.getAuctionBids);

export default router;
