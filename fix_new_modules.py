import os

cms_service = """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CmsService {
  constructor(private prisma: PrismaService) {}

  // Blogs
  getBlogs() { return this.prisma.blog.findMany(); }
  getBlog(id: string) { return this.prisma.blog.findUnique({ where: { id } }); }

  // Banners
  getBanners() { return this.prisma.banner.findMany(); }

  // FAQs
  getFAQs() { return this.prisma.fAQ.findMany(); }
}
"""

cms_controller = """import { Controller, Get, Param } from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('blogs')
  getBlogs() { return this.cmsService.getBlogs(); }

  @Get('blogs/:id')
  getBlog(@Param('id') id: string) { return this.cmsService.getBlog(id); }

  @Get('banners')
  getBanners() { return this.cmsService.getBanners(); }

  @Get('faqs')
  getFAQs() { return this.cmsService.getFAQs(); }
}
"""

support_service = """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  getTickets() { return this.prisma.supportTicket.findMany(); }
}
"""

support_controller = """import { Controller, Get } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('tickets')
  getTickets() { return this.supportService.getTickets(); }
}
"""

settings_service = """import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  getSettings() { return this.prisma.setting.findMany(); }
}
"""

settings_controller = """import { Controller, Get } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings() { return this.settingsService.getSettings(); }
}
"""

with open('Backend/src/modules/cms/cms.service.ts', 'w') as f:
    f.write(cms_service)
with open('Backend/src/modules/cms/cms.controller.ts', 'w') as f:
    f.write(cms_controller)

with open('Backend/src/modules/support/support.service.ts', 'w') as f:
    f.write(support_service)
with open('Backend/src/modules/support/support.controller.ts', 'w') as f:
    f.write(support_controller)

with open('Backend/src/modules/settings/settings.service.ts', 'w') as f:
    f.write(settings_service)
with open('Backend/src/modules/settings/settings.controller.ts', 'w') as f:
    f.write(settings_controller)

print("Updated controllers and services.")
