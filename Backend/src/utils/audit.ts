import prisma from "./prisma";
import { logger } from "./logger";

export const logAudit = async (params: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  payload?: any;
  ip?: string;
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        payload: params.payload
          ? JSON.parse(JSON.stringify(params.payload))
          : null,
        ip: params.ip || null,
      },
    });
  } catch (error) {
    logger.error("Failed to write audit log:", error);
  }
};
