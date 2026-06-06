"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const review_controller_1 = require("../controllers/review.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const reviewSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string(),
        rating: zod_1.z.number().int().min(1).max(5),
        comment: zod_1.z.string().optional()
    })
});
const reviewUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        rating: zod_1.z.number().int().min(1).max(5).optional(),
        comment: zod_1.z.string().optional()
    })
});
router.post('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(reviewSchema), review_controller_1.ReviewController.createReview);
router.get('/:productId', auth_1.auth, review_controller_1.ReviewController.getProductReviews);
router.put('/:id', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER, client_1.Role.ADMIN), (0, validate_1.validate)(reviewUpdateSchema), review_controller_1.ReviewController.updateReview);
router.delete('/:id', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER, client_1.Role.ADMIN), review_controller_1.ReviewController.deleteReview);
exports.default = router;
