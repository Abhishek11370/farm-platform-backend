"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const logger_1 = require("./logger");
const logAudit = async (params) => {
    try {
        await prisma_1.default.auditLog.create({
            data: {
                userId: params.userId,
                action: params.action,
                entity: params.entity,
                entityId: params.entityId || null,
                payload: params.payload ? JSON.parse(JSON.stringify(params.payload)) : null,
                ip: params.ip || null
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to write audit log:', error);
    }
};
exports.logAudit = logAudit;
