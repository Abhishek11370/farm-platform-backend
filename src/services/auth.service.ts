import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { signAccessToken, signRefreshToken } from '../middlewares/auth';
import { Role } from '@prisma/client';

export class AuthService {
  static async register(data: any) {
    const { name, email, phone, password, role } = data;
    const hashed = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email: email ? email.toLowerCase() : null,
        phone: phone || null,
        password: hashed,
        role: role || Role.BUYER
      }
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  }

  static async login(data: any) {
    const { email, phone, password } = data;
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email: email.toLowerCase() } : undefined,
          phone ? { phone } : undefined
        ].filter(Boolean) as any
      }
    });

    if (!user) throw new Error('Invalid credentials');
    if (user.isBlocked) throw new Error('Your account has been blocked');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
  }

  static async refresh(token: string) {
    try {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_change_me';
      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || user.isBlocked) throw new Error('Unauthorized');

      const accessToken = signAccessToken(user);
      const newRefreshToken = signRefreshToken(user);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      };
    } catch {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async getMe(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isBlocked: true,
        createdAt: true
      }
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateProfile(id: string, data: any) {
    const { name, email, phone, password } = data;
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true
      }
    });

    return user;
  }
}
