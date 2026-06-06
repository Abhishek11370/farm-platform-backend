"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
class SearchService {
    static async addSearchKeyword(userId, keyword) {
        if (!keyword || !keyword.trim())
            return null;
        return prisma_1.default.searchHistory.create({
            data: {
                userId,
                keyword: keyword.trim().toLowerCase()
            }
        });
    }
    static async getSearchHistory(userId) {
        return prisma_1.default.searchHistory.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
    }
    static async getTrendingSearches() {
        const raw = await prisma_1.default.searchHistory.groupBy({
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
        return raw.map((item) => ({
            keyword: item.keyword,
            count: item._count.keyword
        }));
    }
}
exports.SearchService = SearchService;
