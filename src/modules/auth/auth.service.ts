import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: any = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(body: { email: string; password: string }) {
    // Validate credentials
    const user = await this.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(data: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword
    });
    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  async refresh(token: string): Promise<any> {
    const payload = this.jwtService.verify(token);
    const newPayload = { email: payload.email, sub: payload.sub, role: payload.role };
    const newToken = this.jwtService.sign(newPayload);
    const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  }

  async getMe(id: string): Promise<any> {
    return this.usersService.findOne(id);
  }

  async updateProfile(id: string, data: any): Promise<any> {
    return this.usersService.update(id, data);
  }
}
