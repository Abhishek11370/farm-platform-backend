import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(req.user.sub, dto);
  }

  @Get('product/:productId')
  findByProduct(
    @Param('productId') productId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.reviewsService.findByProduct(productId, +page, +limit);
  }

  @Get('mine')
  findMine(@Request() req: any) {
    return this.reviewsService.findMine(req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.reviewsService.remove(id, req.user.sub, req.user.role);
  }
}
