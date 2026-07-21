import { Controller, Get, Param, Post, Put, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { CmsService } from './cms.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // Blogs
  @Get('blogs')
  getBlogs() { return this.cmsService.getBlogs(); }

  @Get('blogs/:id')
  getBlog(@Param('id') id: string) { return this.cmsService.getBlog(id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('blogs')
  createBlog(@Body() data: any, @Request() req: any) { 
    return this.cmsService.createBlog(data, req.user.id); 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('blogs/:id')
  updateBlog(@Param('id') id: string, @Body() data: any) { 
    return this.cmsService.updateBlog(id, data); 
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('blogs/:id')
  deleteBlog(@Param('id') id: string) { 
    return this.cmsService.deleteBlog(id); 
  }

  // Banners
  @Get('banners')
  getBanners() { return this.cmsService.getBanners(); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('banners')
  createBanner(@Body() data: any) { return this.cmsService.createBanner(data); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('banners/:id')
  updateBanner(@Param('id') id: string, @Body() data: any) { return this.cmsService.updateBanner(id, data); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('banners/:id')
  deleteBanner(@Param('id') id: string) { return this.cmsService.deleteBanner(id); }

  // FAQs
  @Get('faqs')
  getFAQs() { return this.cmsService.getFAQs(); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('faqs')
  createFAQ(@Body() data: any) { return this.cmsService.createFAQ(data); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('faqs/:id')
  updateFAQ(@Param('id') id: string, @Body() data: any) { return this.cmsService.updateFAQ(id, data); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('faqs/:id')
  deleteFAQ(@Param('id') id: string) { return this.cmsService.deleteFAQ(id); }
}
