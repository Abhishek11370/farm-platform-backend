"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const chat_controller_1 = require("../controllers/chat.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const sendMessageSchema = zod_1.z.object({
    body: zod_1.z.object({
        receiverId: zod_1.z.string(),
        content: zod_1.z.string().min(1)
    })
});
router.get('/:partnerId', auth_1.auth, chat_controller_1.ChatController.getMessages);
router.post('/', auth_1.auth, (0, validate_1.validate)(sendMessageSchema), chat_controller_1.ChatController.sendMessage);
exports.default = router;
