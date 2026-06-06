"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const wishlistAddSchema = zod_1.z.object({
    body: zod_1.z.object({
        productId: zod_1.z.string()
    })
});
router.get('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), wishlist_controller_1.WishlistController.getWishlist);
router.post('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(wishlistAddSchema), wishlist_controller_1.WishlistController.addToWishlist);
router.delete('/:id', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), wishlist_controller_1.WishlistController.removeFromWishlist);
exports.default = router;
