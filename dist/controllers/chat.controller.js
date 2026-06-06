"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
const to_string_1 = require("../utils/to-string");
class ChatController {
    static async getMessages(req, res, next) {
        try {
            const list = await chat_service_1.ChatService.getMessages((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(req.params.partnerId));
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async sendMessage(req, res, next) {
        try {
            const { receiverId, content } = req.body;
            const msg = await chat_service_1.ChatService.sendMessage((0, to_string_1.toStringValue)(req.user.id), (0, to_string_1.toStringValue)(receiverId), content);
            res.status(201).json({ data: msg, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ChatController = ChatController;
