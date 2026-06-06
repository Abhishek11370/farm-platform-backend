"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const delivery_service_1 = require("../services/delivery.service");
const audit_1 = require("../utils/audit");
const to_string_1 = require("../utils/to-string");
class DeliveryController {
    static async listDeliveries(req, res, next) {
        try {
            const filters = {
                status: (0, to_string_1.toStringValueOrUndefined)(req.query.status),
            };
            const list = await delivery_service_1.DeliveryService.listDeliveries((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role), filters);
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async assignDelivery(req, res, next) {
        try {
            const { orderId, agentId, pickupAddr } = req.body;
            const d = await delivery_service_1.DeliveryService.assignDelivery((0, to_string_1.toStringValue)(orderId), (0, to_string_1.toStringValue)(agentId), (0, to_string_1.toStringValue)(pickupAddr));
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'DELIVERY_ASSIGN',
                entity: 'DeliveryAssignment',
                entityId: d.id,
                payload: { orderId: (0, to_string_1.toStringValue)(orderId), agentId: (0, to_string_1.toStringValue)(agentId) },
                ip: req.ip
            });
            res.json({ data: d, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateDeliveryStatus(req, res, next) {
        try {
            const { status } = req.body;
            const d = await delivery_service_1.DeliveryService.updateDeliveryStatus((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(status), (0, to_string_1.toStringValue)(req.user.id));
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'DELIVERY_STATUS_UPDATE',
                entity: 'DeliveryAssignment',
                entityId: (0, to_string_1.toStringValue)(req.params.id),
                payload: { status: (0, to_string_1.toStringValue)(status) },
                ip: req.ip
            });
            res.json({ data: d, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateDeliveryLocation(req, res, next) {
        try {
            const { latitude, longitude } = req.body;
            const d = await delivery_service_1.DeliveryService.updateDeliveryLocation((0, to_string_1.toStringValue)(req.params.id), Number(latitude), Number(longitude), (0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: d, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getEarnings(req, res, next) {
        try {
            const result = await delivery_service_1.DeliveryService.getEarnings((0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAdminEarnings(req, res, next) {
        try {
            const result = await delivery_service_1.DeliveryService.getAdminEarnings();
            res.json({ data: result, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.DeliveryController = DeliveryController;
