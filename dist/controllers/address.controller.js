"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressController = void 0;
const address_service_1 = require("../services/address.service");
const to_string_1 = require("../utils/to-string");
class AddressController {
    static async listAddresses(req, res, next) {
        try {
            const addresses = await address_service_1.AddressService.listAddresses((0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: addresses, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async createAddress(req, res, next) {
        try {
            const address = await address_service_1.AddressService.createAddress((0, to_string_1.toStringValue)(req.user.id), req.body);
            res.status(201).json({ data: address, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateAddress(req, res, next) {
        try {
            const address = await address_service_1.AddressService.updateAddress((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), req.body);
            res.json({ data: address, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteAddress(req, res, next) {
        try {
            await address_service_1.AddressService.deleteAddress((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: { success: true }, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AddressController = AddressController;
