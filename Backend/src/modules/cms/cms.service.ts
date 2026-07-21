import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // Blogs
  getBlogs() { return this.prisma.blog.findMany({ orderBy: { createdAt: 'desc' } }); }
  getBlog(id: string) { return this.prisma.blog.findUnique({ where: { id } }); }
  createBlog(data: any, authorId: string) { 
    return this.prisma.blog.create({ data: { ...data, authorId } }); 
  }
  updateBlog(id: string, data: any) { 
    return this.prisma.blog.update({ where: { id }, data }); 
  }
  deleteBlog(id: string) { 
    return this.prisma.blog.delete({ where: { id } }); 
  }

  // Banners
  getBanners() { return this.prisma.banner.findMany({ orderBy: { createdAt: 'desc' } }); }
  createBanner(data: any) { return this.prisma.banner.create({ data }); }
  updateBanner(id: string, data: any) { return this.prisma.banner.update({ where: { id }, data }); }
  deleteBanner(id: string) { return this.prisma.banner.delete({ where: { id } }); }

  // FAQs
  getFAQs() { return this.prisma.fAQ.findMany({ orderBy: { createdAt: 'desc' } }); }
  createFAQ(data: any) { return this.prisma.fAQ.create({ data }); }
  updateFAQ(id: string, data: any) { return this.prisma.fAQ.update({ where: { id }, data }); }
  deleteFAQ(id: string) { return this.prisma.fAQ.delete({ where: { id } }); }
}
