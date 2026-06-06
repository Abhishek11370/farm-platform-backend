"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationController = void 0;
const verification_service_1 = require("../services/verification.service");
const audit_1 = require("../utils/audit");
const to_string_1 = require("../utils/to-string");
class VerificationController {
    static async submitVerification(req, res, next) {
        try {
            const v = await verification_service_1.VerificationService.submitVerification((0, to_string_1.toStringValue)(req.user.id), req.body);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'VERIFICATION_SUBMIT',
                entity: 'FarmerVerification',
                entityId: v.id,
                ip: req.ip
            });
            res.status(201).json({ data: v, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getFarmerVerifications(req, res, next) {
        try {
            const list = await verification_service_1.VerificationService.getFarmerVerifications((0, to_string_1.toStringValue)(req.user.id));
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async getAllVerifications(req, res, next) {
        try {
            const list = await verification_service_1.VerificationService.getAllVerifications();
            res.json({ data: list, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
    static async reviewVerification(req, res, next) {
        try {
            const { status } = req.body;
            const v = await verification_service_1.VerificationService.reviewVerification((0, to_string_1.toStringValue)(req.params.id), (0, to_string_1.toStringValue)(req.user.id), status);
            await (0, audit_1.logAudit)({
                userId: (0, to_string_1.toStringValue)(req.user.id),
                action: 'VERIFICATION_REVIEW',
                entity: 'FarmerVerification',
                entityId: (0, to_string_1.toStringValue)(req.params.id),
                payload: { status },
                ip: req.ip
            });
            res.json({ data: v, meta: null, error: null });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.VerificationController = VerificationController;
