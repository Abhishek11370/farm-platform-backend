"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const order_controller_1 = require("../controllers/order.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const orderCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        addressId: zod_1.z.string(),
        couponCode: zod_1.z.string().optional(),
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            qty: zod_1.z.number().positive()
        }))
    })
});
const orderStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.OrderStatus)
    })
});
router.get('/', auth_1.auth, order_controller_1.OrderController.listOrders);
router.get('/:id', auth_1.auth, order_controller_1.OrderController.getOrderById);
router.post('/', auth_1.auth, (0, auth_1.allow)(client_1.Role.BUYER), (0, validate_1.validate)(orderCreateSchema), order_controller_1.OrderController.createOrder);
router.patch('/:id/status', auth_1.auth, (0, auth_1.allow)(client_1.Role.FARMER, client_1.Role.ADMIN), (0, validate_1.validate)(orderStatusSchema), order_controller_1.OrderController.updateOrderStatus);
router.delete('/:id', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), order_controller_1.OrderController.deleteOrder);
exports.default = router;
