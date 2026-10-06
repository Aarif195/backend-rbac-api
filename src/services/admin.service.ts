import { prisma } from '../lib/prisma';
import { logAdminAction } from './admin.events';

export async function getRoles() {
  return prisma.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
      _count: {
        select: {
          users: true,
        },
      },
    },
  });
}

export async function assignRole(
  adminUserId: string,
  userId: string,
  roleName: string,
) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error('Role not found');
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId,
      roleId: role.id,
      assignedBy: adminUserId,
    },
  });

  await logAdminAction(adminUserId, 'role_assigned', 'user_role', {
    userId,
    roleName,
  });
}

export async function revokeRole(
  adminUserId: string,
  userId: string,
  roleName: string,
) {
  const role = await prisma.role.findUnique({
    where: { name: roleName },
  });

  if (!role) {
    throw new Error('Role not found');
  }

  await prisma.userRole.deleteMany({
    where: {
      userId,
      roleId: role.id,
    },
  });

  await logAdminAction(adminUserId, 'role_revoked', 'user_role', {
    userId,
    roleName,
  });
}