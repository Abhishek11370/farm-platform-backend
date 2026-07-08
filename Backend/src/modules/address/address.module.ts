import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule, JwtModule],
  controllers: [AddressController],
  providers: [AddressService, PrismaService],
  exports: [AddressService],
})
export class AddressModule {}
