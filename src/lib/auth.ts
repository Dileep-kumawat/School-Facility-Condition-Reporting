import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { DB } from './db';
import { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'default_school_facility_tracking_secret_key_12345';
const COOKIE_NAME = 'school_facility_session';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'parent' | 'teacher' | 'admin';
  name: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await DB.getUser(decoded.userId);
    if (!user) return null;

    // Remove password hash from returned user object for safety
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return userWithoutPassword as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
