"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const wishlist_service_1 = require("../services/wishlist.service");
const to_string_1 = require("../utils/to-string");
class WishlistController {
    static async getWishlist(req, res, next) {
        try {
            const items = await wishlist_service_1.WishlistService.getWishlist((0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: items, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async addToWishlist(req, res, next) {
        try {
            const { productId } = req.body;
            const item = await wishlist_service_1.WishlistService.addToWishlist((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(productId));
            res.status(201).json({ data: item, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async removeFromWishlist(req, res, next) {
        try {
            const result = await wishlist_service_1.WishlistService.removeFromWishlist((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.params.id));
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.WishlistController = WishlistController;
