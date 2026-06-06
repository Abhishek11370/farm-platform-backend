import { Injectable } from '@nestjs/common';
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

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email }
    };
  }

  async register(data: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword
    });
    return {
      access_token: this.jwtService.sign({ email: user.email, sub: user.id }),
      user
    };
  }

  async refresh(token: string): Promise<any> {
    const payload = this.jwtService.verify(token);
    return {
      access_token: this.jwtService.sign({ email: payload.email, sub: payload.sub })
    };
  }

  async getMe(id: string): Promise<any> {
    return this.usersService.findOne(id);
  }

  async updateProfile(id: string, data: any): Promise<any> {
    return this.usersService.update(id, data);
  }
}
