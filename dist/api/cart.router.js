"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const cart_controller_1 = require("../controllers/cart.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const addToCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string(),
        qty: zod_1.z.number().positive()
    })
});
const updateCartSchema = zod_1.z.object({
    body: zod_1.z.object({
        qty: zod_1.z.number().nonnegative()
    })
});
router.get('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), cart_controller_1.CartController.getCart);
router.post('/add', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(addToCartSchema), cart_controller_1.CartController.addToCart);
router.patch('/update/:itemId', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(updateCartSchema), cart_controller_1.CartController.updateCartItem);
router.delete('/remove/:itemId', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), cart_controller_1.CartController.removeCartItem);
exports.default = router;
