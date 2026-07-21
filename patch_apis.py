import os
import re

def update_wishlists_controller():
    path = "Backend/src/modules/wishlists/wishlists.controller.ts"
    with open(path, 'r') as f:
        content = f.read()
    
    new_find_mine = """  @Get()
  findMine(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.wishlistsService.findMine(req.user.sub, +page, +limit);
  }"""
    
    content = re.sub(r'  @Get\(\)\s+findMine\(@Request\(\) req: any\) \{\s+return this.wishlistsService.findMine\(req.user.sub\);\s+\}', new_find_mine, content)
    with open(path, 'w') as f:
        f.write(content)

def update_wishlists_service():
    path = "Backend/src/modules/wishlists/wishlists.service.ts"
    with open(path, 'r') as f:
        content = f.read()

    new_find_mine = """  async findMine(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.wishlist.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          product: {
            include: { images: true, owner: { select: { id: true, name: true } }, category: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.wishlist.count({ where: { userId } })
    ]);
    return { data, total, page, limit };
  }"""

    content = re.sub(r'  async findMine\(userId: string\) \{[\s\S]*?orderBy: \{ createdAt: \'desc\' \},\s+\}\);\s+\}', new_find_mine, content)
    with open(path, 'w') as f:
        f.write(content)

def update_reviews_controller():
    path = "Backend/src/modules/reviews/reviews.controller.ts"
    with open(path, 'r') as f:
        content = f.read()
    
    new_find_mine = """  @Get('mine')
  findMine(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ) {
    return this.reviewsService.findMine(req.user.sub, +page, +limit);
  }"""
    
    content = re.sub(r'  @Get\(\'mine\'\)\s+findMine\(@Request\(\) req: any\) \{\s+return this.reviewsService.findMine\(req.user.sub\);\s+\}', new_find_mine, content)
    with open(path, 'w') as f:
        f.write(content)

def update_reviews_service():
    path = "Backend/src/modules/reviews/reviews.service.ts"
    with open(path, 'r') as f:
        content = f.read()

    new_find_mine = """  async findMine(buyerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where: { buyerId },
        skip,
        take: limit,
        include: {
          product: { select: { id: true, name: true, images: true } },
          buyer: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { buyerId } })
    ]);
    return { data, total, page, limit };
  }"""

    content = re.sub(r'  async findMine\(buyerId: string\) \{[\s\S]*?\}\);\s+\}', new_find_mine, content)
    with open(path, 'w') as f:
        f.write(content)

if __name__ == "__main__":
    update_wishlists_controller()
    update_wishlists_service()
    update_reviews_controller()
    update_reviews_service()
    print("Done updating Wishlists and Reviews")
