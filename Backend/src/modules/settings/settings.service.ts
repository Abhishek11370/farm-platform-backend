import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  getSettings() { return this.prisma.setting.findMany(); }

  async bulkUpsert(settings: { key: string; value: string }[]) {
    const transactions = settings.map((setting) => 
      this.prisma.setting.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: { key: setting.key, value: setting.value },
      })
    );
    return this.prisma.$transaction(transactions);
  }
}
