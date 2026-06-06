"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const delivery_controller_1 = require("../controllers/delivery.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const assignDeliverySchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string(),
        agentId: zod_1.z.string(),
        pickupAddr: zod_1.z.string()
    })
});
const updateStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.string().min(1)
    })
});
const updateLocationSchema = zod_1.z.object({
    body: zod_1.z.object({
        latitude: zod_1.z.number(),
        longitude: zod_1.z.number()
    })
});
router.get('/deliveries', auth_1.auth, delivery_controller_1.DeliveryController.listDeliveries);
router.post('/assign', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), (0, validate_1.validate)(assignDeliverySchema), delivery_controller_1.DeliveryController.assignDelivery);
router.patch('/deliveries/:id/status', auth_1.auth, (0, auth_1.allow)(client_1.Role.DELIVERY, client_1.Role.ADMIN), (0, validate_1.validate)(updateStatusSchema), delivery_controller_1.DeliveryController.updateDeliveryStatus);
router.patch('/deliveries/:id/location', auth_1.auth, (0, auth_1.allow)(client_1.Role.DELIVERY), (0, validate_1.validate)(updateLocationSchema), delivery_controller_1.DeliveryController.updateDeliveryLocation);
router.get('/earnings', auth_1.auth, (0, auth_1.allow)(client_1.Role.DELIVERY), delivery_controller_1.DeliveryController.getEarnings);
router.get('/admin-earnings', auth_1.auth, (0, auth_1.allow)(client_1.Role.ADMIN), delivery_controller_1.DeliveryController.getAdminEarnings);
exports.default = router;
