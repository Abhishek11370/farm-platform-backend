"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const to_string_1 = require("../utils/to-string");
class NotificationController {
    static async getNotifications(req, res, next) {
        try {
            const list = await notification_service_1.NotificationService.getNotifications((0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async markAsRead(req, res, next) {
        try {
            const notif = await notification_service_1.NotificationService.markAsRead((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: notif, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.NotificationController = NotificationController;
