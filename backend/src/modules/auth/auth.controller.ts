import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
};

export async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ accessToken: result.accessToken, user: result.user });
  } catch (err) { next(err); }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
    res.json({ accessToken: result.accessToken, user: result.user });
  } catch (err) { next(err); }
}

export async function refreshHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) { res.status(401).json({ error: 'No refresh token' }); return; }
    const result = await authService.refresh(token);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);
    res.json({ accessToken: result.accessToken });
  } catch (err) { next(err); }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.refreshToken;
    if (token) await authService.logout(token);
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
}
