import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import {
  findUserByEmail, findUserById, createUser,
  saveRefreshToken, findRefreshToken, revokeRefreshToken,
} from './auth.repository';
import { createError } from '../../middleware/error.middleware';

export async function register(email: string, password: string, name: string) {
  const existing = await findUserByEmail(email);
  if (existing) throw createError('Email already in use', 409);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ email, passwordHash, name });

  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user.id, email: user.email });
  await saveRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } };
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw createError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw createError('Invalid credentials', 401);

  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const refreshToken = signRefreshToken({ userId: user.id, email: user.email });
  await saveRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } };
}

export async function refresh(token: string) {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw createError('Invalid refresh token', 401);
  }

  const stored = await findRefreshToken(token);
  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw createError('Refresh token expired or revoked', 401);
  }

  const user = await findUserById(payload.userId);
  if (!user) throw createError('User not found', 404);

  await revokeRefreshToken(token);
  const newAccessToken = signAccessToken({ userId: user.id, email: user.email });
  const newRefreshToken = signRefreshToken({ userId: user.id, email: user.email });
  await saveRefreshToken(user.id, newRefreshToken);

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logout(token: string) {
  const stored = await findRefreshToken(token);
  if (stored && !stored.revokedAt) await revokeRefreshToken(token);
}
