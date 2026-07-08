import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderRepository } from "./order.repository";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { RolesGuard } from "../../common/guards/roles.guard";

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    PrismaService,
    JwtAuthGuard,
    RolesGuard,
  ],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") || "defaultSecret",
        signOptions: { expiresIn: "3600s" },
      }),
    }),
  ],
  exports: [OrderService],
})
export class OrderModule {}
