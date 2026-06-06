import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { RequestUser } from '../types/request-user';





const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({
      data: null,
      meta: null,
      error: { code: 'UNAUTHORIZED', message: 'Authentication token missing' }
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    const decoded: RequestUser = {
      id: payload.id,
      role: payload.role,
      email: payload.email,
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      data: null,
      meta: null,
      error: { code: 'UNAUTHORIZED', message: 'Invalid or expired authentication token' }
    });
  }
};

export const allow = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        data: null,
        meta: null,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        data: null,
        meta: null,
        error: { code: 'FORBIDDEN', message: 'Access denied: insufficient permissions' }
      });
    }

    next();
  };
};

export const signAccessToken = (user: RequestUser): string => {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: '15m'
  });
};

export const signRefreshToken = (user: RequestUser): string => {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: '7d'
  });
};
