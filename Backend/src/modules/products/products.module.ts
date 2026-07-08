import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, JwtAuthGuard],
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
  exports: [ProductsService],
})
export class ProductsModule {}
