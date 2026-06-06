"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.auth, notification_controller_1.NotificationController.getNotifications);
router.patch('/:id/read', auth_1.auth, notification_controller_1.NotificationController.markAsRead);
exports.default = router;
