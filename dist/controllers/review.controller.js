"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("../services/review.service");
const to_string_1 = require("../utils/to-string");
class ReviewController {
    static async createReview(req, res, next) {
        try {
            const review = await review_service_1.ReviewService.createReview((0, to_string_1.toStringValue)(req.user.id), req.body);
            res.status(201).json({ data: review, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getProductReviews(req, res, next) {
        try {
            const list = await review_service_1.ReviewService.getProductReviews((0, to_string_1.toStringValue)(req.params.productId));
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateReview(req, res, next) {
        try {
            const review = await review_service_1.ReviewService.updateReview((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role), req.body);
            res.json({ data: review, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteReview(req, res, next) {
        try {
            await review_service_1.ReviewService.deleteReview((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role));
            res.json({ data: { success: true }, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ReviewController = ReviewController;
