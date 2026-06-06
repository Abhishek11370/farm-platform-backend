"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLiveChatMessage = exports.broadcastDeliveryLocation = exports.notifyOrderStatus = exports.broadcastAuctionClosed = exports.broadcastAuctionBid = exports.notifyUser = exports.initSockets = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';
let io = null;
const userSockets = new Map(); // Map userId -> socketIds
const initSockets = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    // Authentication Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            socket.data.user = decoded;
            next();
        }
        catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const user = socket.data.user;
        logger_1.logger.info(`User connected to Socket.io: ${user.id}`);
        // Register user socket
        const existing = userSockets.get(user.id) || [];
        existing.push(socket.id);
        userSockets.set(user.id, existing);
        // Join personal room and role room
        socket.join(`user_${user.id}`);
        socket.join(`role_${user.role}`);
        // Join auction room
        socket.on('auction:join', (auctionId) => {
            socket.join(`auction_${auctionId}`);
            logger_1.logger.debug(`Socket ${socket.id} joined auction_${auctionId}`);
            socket.emit('auction:joined', { auctionId });
        });
        // Chat: typing status
        socket.on('chat:typing', (data) => {
            io?.to(`user_${data.toUserId}`).emit('chat:typing', {
                fromUserId: user.id,
                isTyping: data.isTyping
            });
        });
        socket.on('disconnect', () => {
            logger_1.logger.info(`User disconnected from Socket.io: ${user.id}`);
            const sockets = userSockets.get(user.id) || [];
            const updated = sockets.filter(id => id !== socket.id);
            if (updated.length > 0) {
                userSockets.set(user.id, updated);
            }
            else {
                userSockets.delete(user.id);
            }
        });
    });
    return io;
};
exports.initSockets = initSockets;
// --- HELPER EMITTERS ---
const notifyUser = (userId, notification) => {
    if (io) {
        io.to(`user_${userId}`).emit('notification:new', notification);
        logger_1.logger.debug(`Real-time notification emitted to user_${userId}`);
    }
};
exports.notifyUser = notifyUser;
const broadcastAuctionBid = (auctionId, bidData) => {
    if (io) {
        io.to(`auction_${auctionId}`).emit('auction:newBid', { auctionId, bid: bidData });
        logger_1.logger.debug(`Real-time bid broadcast to auction_${auctionId}`);
    }
};
exports.broadcastAuctionBid = broadcastAuctionBid;
const broadcastAuctionClosed = (auctionId, result) => {
    if (io) {
        io.to(`auction_${auctionId}`).emit('auction:closed', result);
        logger_1.logger.debug(`Real-time auction closed broadcast to auction_${auctionId}`);
    }
};
exports.broadcastAuctionClosed = broadcastAuctionClosed;
const notifyOrderStatus = (buyerId, orderData) => {
    if (io) {
        io.to(`user_${buyerId}`).emit('order:statusUpdate', orderData);
        // Also notify admins
        io.to('role_ADMIN').emit('order:statusUpdate', orderData);
    }
};
exports.notifyOrderStatus = notifyOrderStatus;
const broadcastDeliveryLocation = (deliveryId, locationData) => {
    if (io) {
        io.to(`delivery_${deliveryId}`).emit('delivery:location', locationData);
    }
};
exports.broadcastDeliveryLocation = broadcastDeliveryLocation;
const sendLiveChatMessage = (toUserId, messageData) => {
    if (io) {
        io.to(`user_${toUserId}`).emit('chat:receive', messageData);
    }
};
exports.sendLiveChatMessage = sendLiveChatMessage;
