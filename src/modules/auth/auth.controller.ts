import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { logAudit } from '../../utils/audit';
import { Controller, Post, Get, Patch, Body, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../../types/authenticated-request';



/**
 * AuthController provides authentication related endpoints.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any, @Res() res: Response, @Req() req: AuthenticatedRequest, next: NextFunction) {
    try {
      const result = await this.authService.register(body);
      await logAudit({
        userId: result.user.id,
        action: 'USER_REGISTER',
        entity: 'User',
        entityId: result.user.id,
        ip: req.ip,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  @Post('login')
  async login(@Body() body: any, @Res() res: Response, @Req() req: AuthenticatedRequest, next: NextFunction) {
    try {
      const result = await this.authService.login(body);
      await logAudit({
        userId: result.user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: result.user.id,
        ip: req.ip,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @Post('refresh')
  async refresh(@Body() body: any, @Res() res: Response, next: NextFunction) {
    try {
      const { refreshToken } = body;
      if (!refreshToken) {
        return res.status(400).json({
          data: null,
          meta: null,
          error: { code: 'BAD_REQUEST', message: 'Refresh token is required' },
        });
      }
      const result = await this.authService.refresh(refreshToken);
      res.json({ data: result, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async logout(@Req() req: AuthenticatedRequest, @Res() res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await logAudit({
          userId: (req.user as any).id,
          action: 'USER_LOGOUT',
          entity: 'User',
          entityId: (req.user as any).id,
          ip: req.ip,
        });
      }
      res.json({ data: { message: 'Logged out successfully' }, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async getMe(@Req() req: AuthenticatedRequest, @Res() res: Response, next: NextFunction) {
    try {
      const user = await this.authService.getMe((req.user as any).id);
      res.json({ data: user, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async updateProfile(@Req() req: AuthenticatedRequest, @Body() body: any, @Res() res: Response, next: NextFunction) {
    try {
      const user = await this.authService.updateProfile((req.user as any).id, body);
      await logAudit({
        userId: req.user!.id,
        action: 'USER_PROFILE_UPDATE',
        entity: 'User',
        entityId: req.user!.id,
        ip: req.ip,
      });
      res.json({ data: user, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
