import { Request, Response, NextFunction } from 'express';
import { SearchService } from '../services/search.service';

export class SearchController {
  static async addSearchKeyword(req: Request, res: Response, next: NextFunction) {
    try {
      const { keyword } = req.body;
      const history = await SearchService.addSearchKeyword(req.user!.id, keyword);
      res.status(201).json({ data: history, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getSearchHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await SearchService.getSearchHistory(req.user!.id);
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }

  static async getTrendingSearches(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await SearchService.getTrendingSearches();
      res.json({ data: list, meta: null, error: null });
    } catch (err) {
      next(err);
    }
  }
}
