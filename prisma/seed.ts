import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const permissions = [
    ['documents', 'create'],
    ['documents', 'read'],
    ['documents', 'update'],
    ['documents', 'delete'],
    ['conversations', 'create'],
    ['conversations', 'read'],
    ['users', 'read'],
    ['users', 'manage'],
    ['roles', 'manage'],
  ];

  for (const [resource, action] of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action: { resource, action },
      },
      update: {},
      create: {
        name: `${resource}:${action}`,
        resource,
        action,
      },
    });
  }

  const allPermissions = await prisma.permission.findMany();

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Full system access',
    },
  });

  const memberRole = await prisma.role.upsert({
    where: { name: 'member' },
    update: {},
    create: {
      name: 'member',
      description: 'Standard member access',
      isDefault: true,
    },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      description: 'Read-only access',
    },
  });

  const memberPermissions = [
    'documents:create',
    'documents:read',
    'documents:update',
    'documents:delete',
    'conversations:read',
  ];

  const viewerPermissions = [
    'documents:read',
    'conversations:read',
  ];

  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  for (const permissionName of memberPermissions) {
    const permission = allPermissions.find(
      (item) => item.name === permissionName,
    );

    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: memberRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: memberRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  for (const permissionName of viewerPermissions) {
    const permission = allPermissions.find(
      (item) => item.name === permissionName,
    );

    if (permission) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: viewerRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const password = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      email: 'member@example.com',
      password,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: testUser.id,
        roleId: memberRole.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      roleId: memberRole.id,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());