"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activity_service_1 = require("../services/activity.service");
class ActivityController {
    static async getUserActivities(req, res, next) {
        try {
            const list = await activity_service_1.ActivityService.getUserActivities(req.user.id);
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAllActivities(req, res, next) {
        try {
            const list = await activity_service_1.ActivityService.getAllActivities();
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ActivityController = ActivityController;
