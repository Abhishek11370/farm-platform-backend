import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles(Role.BUYER)
  async getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @Roles(Role.BUYER)
  async addToCart(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto.productId, dto.qty);
  }

  @Patch(':itemId')
  @Roles(Role.BUYER)
  async updateCartItem(@Param('itemId') itemId: string, @Req() req: any, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateCartItem(req.user.id, itemId, dto.qty);
  }

  @Delete(':itemId')
  @Roles(Role.BUYER)
  async removeCartItem(@Param('itemId') itemId: string, @Req() req: any) {
    return this.cartService.removeCartItem(req.user.id, itemId);
  }
}
