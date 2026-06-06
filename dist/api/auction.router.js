"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auction_controller_1 = require("../controllers/auction.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const auctionCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string(),
        startTime: zod_1.z.string().datetime(),
        endTime: zod_1.z.string().datetime(),
        basePrice: zod_1.z.number().positive()
    })
});
const auctionUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.AuctionStatus).optional(),
        basePrice: zod_1.z.number().positive().optional(),
        startTime: zod_1.z.string().datetime().optional(),
        endTime: zod_1.z.string().datetime().optional()
    })
});
const bidSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive()
    })
});
router.get('/', auth_1.auth, auction_controller_1.AuctionController.listAuctions);
router.get('/:id', auth_1.auth, auction_controller_1.AuctionController.getAuctionById);
router.post('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), (0, validate_1.validate)(auctionCreateSchema), auction_controller_1.AuctionController.createAuction);
router.put('/:id', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), (0, validate_1.validate)(auctionUpdateSchema), auction_controller_1.AuctionController.updateAuction);
router.post('/:id/bid', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(bidSchema), auction_controller_1.AuctionController.placeBid);
router.get('/:id/bids', auth_1.auth, auction_controller_1.AuctionController.getAuctionBids);
exports.default = router;
