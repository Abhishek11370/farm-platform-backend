"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const search_service_1 = require("../services/search.service");
class SearchController {
    static async addSearchKeyword(req, res, next) {
        try {
            const { keyword } = req.body;
            const history = await search_service_1.SearchService.addSearchKeyword(req.user.id, keyword);
            res.status(201).json({ data: history, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getSearchHistory(req, res, next) {
        try {
            const list = await search_service_1.SearchService.getSearchHistory(req.user.id);
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getTrendingSearches(req, res, next) {
        try {
            const list = await search_service_1.SearchService.getTrendingSearches();
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SearchController = SearchController;
