import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export async function register(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const defaultRole = await prisma.role.findFirst({
    where: { isDefault: true },
  });

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      roles: defaultRole
        ? {
            create: {
              roleId: defaultRole.id,
            },
          }
        : undefined,
    },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  return user;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '1h' },
  );

  return { token };
}