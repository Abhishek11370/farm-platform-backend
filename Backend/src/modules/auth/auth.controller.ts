import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { logAudit } from "../../utils/audit";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { AuthenticatedRequest } from "../../types/authenticated-request";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Req() req: AuthenticatedRequest) {
    const result = await this.authService.register(dto);
    await logAudit({
      userId: result.user.id,
      action: "USER_REGISTER",
      entity: "User",
      entityId: result.user.id,
      ip: req.ip,
    });
    return result;
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Req() req: AuthenticatedRequest) {
    const result = await this.authService.login(dto);
    await logAudit({
      userId: result.user.id,
      action: "USER_LOGIN",
      entity: "User",
      entityId: result.user.id,
      ip: req.ip,
    });
    return result;
  }

  @Post("refresh")
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async logout(@Req() req: AuthenticatedRequest) {
    if (req.user) {
      await logAudit({
        userId: (req.user as any).id,
        action: "USER_LOGOUT",
        entity: "User",
        entityId: (req.user as any).id,
        ip: req.ip,
      });
    }
    return { message: "Logged out successfully" };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.authService.getMe((req.user as any).id);
  }

  @Patch("me")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FARMER, Role.BUYER, Role.DELIVERY)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.authService.updateProfile(
      (req.user as any).id,
      dto,
    );
    await logAudit({
      userId: req.user!.id,
      action: "USER_PROFILE_UPDATE",
      entity: "User",
      entityId: req.user!.id,
      ip: req.ip,
    });
    return user;
  }
}
