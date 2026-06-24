"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const prisma_service_1 = require("./prisma/prisma.service");
const activity_module_1 = require("./modules/activity/activity.module");
const health_controller_1 = require("./health.controller");
const address_module_1 = require("./modules/address/address.module");
const auction_module_1 = require("./modules/auction/auction.module");
const cart_module_1 = require("./modules/cart/cart.module");
const chat_module_1 = require("./modules/chat/chat.module");
const delivery_module_1 = require("./modules/delivery/delivery.module");
const products_module_1 = require("./modules/products/products.module");
const users_module_1 = require("./modules/users/users.module");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            auth_module_1.AuthModule,
            activity_module_1.ActivityModule,
            address_module_1.AddressModule,
            auction_module_1.AuctionModule,
            cart_module_1.CartModule,
            chat_module_1.ChatModule,
            delivery_module_1.DeliveryModule,
            products_module_1.ProductsModule,
            users_module_1.UsersModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [prisma_service_1.PrismaService],
    })
], AppModule);
