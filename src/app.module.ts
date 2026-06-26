import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { ActivityModule } from './modules/activity/activity.module';
import { HealthController } from './health.controller';
import { AddressModule } from './modules/address/address.module';
import { AuctionModule } from './modules/auction/auction.module';
import { CartModule } from './modules/cart/cart.module';
import { ChatModule } from './modules/chat/chat.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().default(5003),
        ALLOWED_ORIGINS: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        REFRESH_SECRET: Joi.string().required(),
        CLOUDINARY_URL: Joi.string().optional(),
        RAZORPAY_KEY_ID: Joi.string().optional(),
        RAZORPAY_KEY_SECRET: Joi.string().optional(),
      }),
    }),
    AuthModule,
    ActivityModule,
    AddressModule,
    AuctionModule,
    CartModule,
    ChatModule,
    DeliveryModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
