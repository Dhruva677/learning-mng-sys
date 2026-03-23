import prisma from '../../utils/prisma';
import { hashToken, getRefreshTokenExpiry } from '../../utils/jwt';

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: { email: string; passwordHash: string; name: string }) {
  return prisma.user.create({ data });
}

export async function saveRefreshToken(userId: number, token: string) {
  return prisma.refreshToken.create({
    data: { userId, tokenHash: hashToken(token), expiresAt: getRefreshTokenExpiry() },
  });
}

export async function findRefreshToken(token: string) {
  return prisma.refreshToken.findUnique({ where: { tokenHash: hashToken(token) } });
}

export async function revokeRefreshToken(token: string) {
  return prisma.refreshToken.update({
    where: { tokenHash: hashToken(token) },
    data: { revokedAt: new Date() },
  });
}
