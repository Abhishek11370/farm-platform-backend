"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const audit_1 = require("../utils/audit");
const to_string_1 = require("../utils/to-string");
class OrderController {
    static async createOrder(req, res, next) {
        try {
            const order = await order_service_1.OrderService.createOrder((0, to_string_1.toStringValue)(req.user.id), req.body);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'ORDER_CREATE',
                entity: 'Order',
                entityId: order.id,
                payload: { amount: order.totalAmount },
                ip: req.ip
            });
            res.status(201).json({ data: order, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async listOrders(req, res, next) {
        try {
            const filters = {
                status: (0, to_string_1.toStringValueOrUndefined)(req.query.status),
                page: (0, to_string_1.toStringValueOrUndefined)(req.query.page) ? Number((0, to_string_1.toStringValue)(req.query.page)) : undefined,
                limit: (0, to_string_1.toStringValueOrUndefined)(req.query.limit) ? Number((0, to_string_1.toStringValue)(req.query.limit)) : undefined,
            };
            const result = await order_service_1.OrderService.listOrders((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role), filters);
            res.json({ data: result.orders, meta: result.pagination, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getOrderById(req, res, next) {
        try {
            const order = await order_service_1.OrderService.getOrderById((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role));
            res.json({ data: order, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async updateOrderStatus(req, res, next) {
        try {
            const { status } = req.body;
            const order = await order_service_1.OrderService.updateOrderStatus((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(status), (0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.user.role));
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'ORDER_STATUS_UPDATE',
                entity: 'Order',
                entityId: (0, to_string_1.toStringValue)(req.params.id),
                payload: { status: (0, to_string_1.toStringValue)(status) },
                ip: req.ip
            });
            res.json({ data: order, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteOrder(req, res, next) {
        try {
            await order_service_1.OrderService.deleteOrder((0, to_string_1.toStringValue)(req.params.id));
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'ORDER_DELETE',
                entity: 'Order',
                entityId: (0, to_string_1.toStringValue)(req.params.id),
                ip: req.ip
            });
            res.json({ data: { success: true }, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.OrderController = OrderController;
