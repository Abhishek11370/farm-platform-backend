"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const address_controller_1 = require("../controllers/address.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const addressSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2),
        phone: zod_1.z.string().min(10),
        addressLine1: zod_1.z.string().min(3),
        addressLine2: zod_1.z.string().optional(),
        city: zod_1.z.string().min(2),
        state: zod_1.z.string().min(2),
        pincode: zod_1.z.string().min(6),
        isDefault: zod_1.z.boolean().optional()
    })
});
const addressUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2).optional(),
        phone: zod_1.z.string().min(10).optional(),
        addressLine1: zod_1.z.string().min(3).optional(),
        addressLine2: zod_1.z.string().optional(),
        city: zod_1.z.string().min(2).optional(),
        state: zod_1.z.string().min(2).optional(),
        pincode: zod_1.z.string().min(6).optional(),
        isDefault: zod_1.z.boolean().optional()
    })
});
router.get('/', auth_1.auth, address_controller_1.AddressController.listAddresses);
router.post('/', auth_1.auth, (0, validate_1.validate)(addressSchema), address_controller_1.AddressController.createAddress);
router.put('/:id', auth_1.auth, (0, validate_1.validate)(addressUpdateSchema), address_controller_1.AddressController.updateAddress);
router.delete('/:id', auth_1.auth, address_controller_1.AddressController.deleteAddress);
exports.default = router;
