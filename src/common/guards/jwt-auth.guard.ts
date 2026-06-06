import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization?.split(' ')[1];
    if (!authHeader) return false;
    try {
      const payload = this.jwtService.verify(authHeader);
      request['user'] = payload;
      return true;
    } catch {
      return false;
    }
  }
}
