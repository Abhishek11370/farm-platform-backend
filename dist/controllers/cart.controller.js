"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_service_1 = require("../services/cart.service");
const to_string_1 = require("../utils/to-string");
class CartController {
    static async getCart(req, res, next) {
        try {
            const cart = await cart_service_1.CartService.getCart((0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: cart, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async addToCart(req, res, next) {
        try {
            const { productId, qty } = req.body;
            const item = await cart_service_1.CartService.addToCart((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(productId), qty || 1);
            res.status(201).json({ data: item, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateCartItem(req, res, next) {
        try {
            const { qty } = req.body;
            const result = await cart_service_1.CartService.updateCartItem((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.params.itemId), qty);
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async removeCartItem(req, res, next) {
        try {
            const result = await cart_service_1.CartService.removeCartItem((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.params.itemId));
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CartController = CartController;
