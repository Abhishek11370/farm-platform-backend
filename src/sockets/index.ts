import { Server as SocketServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { RequestUser } from '../types/request-user';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';

let io: SocketServer | null = null;
const userSockets = new Map<string, string[]>(); // Map userId -> socketIds

export const initSockets = (server: HTTPServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Authentication Middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token as string, JWT_SECRET) as RequestUser;
      socket.data.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as RequestUser;
    logger.info(`User connected to Socket.io: ${user.id}`);

    // Register user socket
    const existing = userSockets.get(user.id) || [];
    existing.push(socket.id);
    userSockets.set(user.id, existing);

    // Join personal room and role room
    socket.join(`user_${user.id}`);
    socket.join(`role_${user.role}`);

    // Join auction room
    socket.on('auction:join', (auctionId: string) => {
      socket.join(`auction_${auctionId}`);
      logger.debug(`Socket ${socket.id} joined auction_${auctionId}`);
      socket.emit('auction:joined', { auctionId });
    });

    // Chat: typing status
    socket.on('chat:typing', (data: { toUserId: string; isTyping: boolean }) => {
      io?.to(`user_${data.toUserId}`).emit('chat:typing', {
        fromUserId: user.id,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected from Socket.io: ${user.id}`);
      const sockets = userSockets.get(user.id) || [];
      const updated = sockets.filter(id => id !== socket.id);
      if (updated.length > 0) {
        userSockets.set(user.id, updated);
      } else {
        userSockets.delete(user.id);
      }
    });
  });

  return io;
};

// --- HELPER EMITTERS ---

export const notifyUser = (userId: string, notification: {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: Date;
}) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification:new', notification);
    logger.debug(`Real-time notification emitted to user_${userId}`);
  }
};

export const broadcastAuctionBid = (auctionId: string, bidData: {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  createdAt: Date;
}) => {
  if (io) {
    io.to(`auction_${auctionId}`).emit('auction:newBid', { auctionId, bid: bidData });
    logger.debug(`Real-time bid broadcast to auction_${auctionId}`);
  }
};

export const broadcastAuctionClosed = (auctionId: string, result: {
  auctionId: string;
  winnerId?: string;
  winnerName?: string;
  winningAmount?: number;
  status: string;
}) => {
  if (io) {
    io.to(`auction_${auctionId}`).emit('auction:closed', result);
    logger.debug(`Real-time auction closed broadcast to auction_${auctionId}`);
  }
};

export const notifyOrderStatus = (buyerId: string, orderData: {
  orderId: string;
  status: string;
}) => {
  if (io) {
    io.to(`user_${buyerId}`).emit('order:statusUpdate', orderData);
    // Also notify admins
    io.to('role_ADMIN').emit('order:statusUpdate', orderData);
  }
};

export const broadcastDeliveryLocation = (deliveryId: string, locationData: {
  deliveryId: string;
  lat: number;
  lng: number;
}) => {
  if (io) {
    io.to(`delivery_${deliveryId}`).emit('delivery:location', locationData);
  }
};

export const sendLiveChatMessage = (toUserId: string, messageData: {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}) => {
  if (io) {
    io.to(`user_${toUserId}`).emit('chat:receive', messageData);
  }
};
