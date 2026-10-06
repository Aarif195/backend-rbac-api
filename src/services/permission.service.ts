import { prisma } from '../lib/prisma';

export async function getUserPermissions(userId: string) {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    include: {
      role: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  return userRoles.flatMap((userRole) =>
    userRole.role.permissions.map(
      (rolePermission) => rolePermission.permission.name,
    ),
  );
}