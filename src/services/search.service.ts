import prisma from '../utils/prisma';

export class SearchService {
  static async addSearchKeyword(userId: string, keyword: string) {
    if (!keyword || !keyword.trim()) return null;
    return prisma.searchHistory.create({
      data: {
        userId,
        keyword: keyword.trim().toLowerCase()
      }
    });
  }

  static async getSearchHistory(userId: string) {
    return prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
  }

  static async getTrendingSearches() {
    const raw = await prisma.searchHistory.groupBy({
      by: ['keyword'],
      _count: {
        keyword: true
      },
      orderBy: {
        _count: {
          keyword: 'desc'
        }
      },
      take: 10
    });

    return raw.map((item: any) => ({
      keyword: item.keyword,
      count: item._count.keyword
    }));
  }
}
