import { prisma } from '../lib/prisma';

export async function createDocument(
  userId: string,
  title: string,
  content: string,
) {
  return prisma.document.create({
    data: {
      userId,
      title,
      content,
    },
  });
}

export async function getDocuments(userId: string) {
  return prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDocument(id: string, userId: string) {
  return prisma.document.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function updateDocument(
  id: string,
  userId: string,
  title: string,
  content: string,
) {
  return prisma.document.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      title,
      content,
    },
  });
}

export async function deleteDocument(id: string, userId: string) {
  return prisma.document.deleteMany({
    where: {
      id,
      userId,
    },
  });
}