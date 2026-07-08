import { Controller, Get, Post, Delete, Param, Query, UseGuards, Request, Body } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findMine(@Request() req: any) {
    return this.wishlistsService.findMine(req.user.sub);
  }

  @Post()
  add(@Request() req: any, @Body('productId') productId: string) {
    return this.wishlistsService.add(req.user.sub, productId);
  }

  @Get('check/:productId')
  check(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistsService.check(req.user.sub, productId);
  }

  @Delete('clear')
  clearAll(@Request() req: any) {
    return this.wishlistsService.clearAll(req.user.sub);
  }

  @Delete(':productId')
  remove(@Request() req: any, @Param('productId') productId: string) {
    return this.wishlistsService.remove(req.user.sub, productId);
  }
}
