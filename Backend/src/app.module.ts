import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { ActivityModule } from "./modules/activity/activity.module";
import { HealthController } from "./health.controller";
import { AddressModule } from "./modules/address/address.module";
import { AuctionModule } from "./modules/auction/auction.module";
import { CartModule } from "./modules/cart/cart.module";
import { ChatModule } from "./modules/chat/chat.module";
import { DeliveryModule } from "./modules/delivery/delivery.module";
import { OrderModule } from "./modules/order/order.module";
import { ProductsModule } from "./modules/products/products.module";
import { UsersModule } from "./modules/users/users.module";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WishlistsModule } from './modules/wishlists/wishlists.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { FarmerVerificationModule } from './modules/farmer-verification/farmer-verification.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

import * as Joi from "joi";

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
        CLOUDINARY_URL: Joi.string().allow("").optional(),
        RAZORPAY_KEY_ID: Joi.string().allow("").optional(),
        RAZORPAY_KEY_SECRET: Joi.string().allow("").optional(),
      }),
    }),
    AuthModule,
    ActivityModule,
    AddressModule,
    AuctionModule,
    CartModule,
    ChatModule,
    DeliveryModule,
    OrderModule,
    ProductsModule,
    UsersModule,
    PaymentsModule,
    NotificationsModule,
    WishlistsModule,
    ReviewsModule,
    CouponsModule,
    FarmerVerificationModule,
    AnalyticsModule,
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
