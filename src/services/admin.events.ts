import { prisma } from '../lib/prisma';

export async function logAdminAction(
  userId: string,
  action: string,
  resource: string,
  metadata?: Record<string, unknown>,
) {
  await prisma.usageLog.create({
    data: {
      userId,
      action,
      resource,
      metadata,
    },
  });
}