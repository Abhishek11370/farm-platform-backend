import { Router } from 'express';
import { z } from 'zod';
import { SearchController } from '../controllers/search.controller';
import { validate } from '../middlewares/validate';
import { auth } from '../middlewares/auth';

const router = Router();

const keywordSchema = z.object({
  body: z.object({
    keyword: z.string().min(1)
  })
});

router.post('/history', auth, validate(keywordSchema), SearchController.addSearchKeyword);
router.get('/history', auth, SearchController.getSearchHistory);
router.get('/trending', auth, SearchController.getTrendingSearches);

export default router;
