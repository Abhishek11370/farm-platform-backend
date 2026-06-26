import { Module } from '@nestjs/common';
import { ProductController } from '../../controllers/product.controller';
import { ProductService } from '../../services/product.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, JwtAuthGuard],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'defaultSecret',
        signOptions: { expiresIn: '3600s' },
      }),
    }),
  ],
  exports: [ProductService],
})
export class ProductsModule {}
