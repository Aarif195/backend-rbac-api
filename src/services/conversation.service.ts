import { prisma } from '../lib/prisma';

export async function createConversation(
  userId: string,
  title: string,
) {
  return prisma.conversation.create({
    data: {
      userId,
      title,
    },
  });
}

export async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}