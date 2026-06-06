"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const search_controller_1 = require("../controllers/search.controller");
const validate_1 = require("../middlewares/validate");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const keywordSchema = zod_1.z.object({
    body: zod_1.z.object({
        keyword: zod_1.z.string().min(1)
    })
});
router.post('/history', auth_1.auth, (0, validate_1.validate)(keywordSchema), search_controller_1.SearchController.addSearchKeyword);
router.get('/history', auth_1.auth, search_controller_1.SearchController.getSearchHistory);
router.get('/trending', auth_1.auth, search_controller_1.SearchController.getTrendingSearches);
exports.default = router;
