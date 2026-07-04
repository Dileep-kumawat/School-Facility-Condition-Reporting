import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'school_facility_session';

interface DecodedToken {
  userId: string;
  email: string;
  role: 'parent' | 'teacher' | 'admin';
  name: string;
  exp?: number;
}

// Simple base64url decoder that works in Next.js Edge runtime
function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as DecodedToken;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Paths that require authentication
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isAdminPath = pathname.startsWith('/admin');
  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isDashboardPath || isAdminPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const decoded = decodeJwt(token);
    if (!decoded) {
      // Invalid token, clear and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    // Check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    // Role-based authorization for Admin paths
    if (isAdminPath && decoded.role !== 'admin') {
      // Redirect teachers or parents away from admin panels to the default dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect logged-in users away from login/register
  if (isAuthPath && token) {
    const decoded = decodeJwt(token);
    if (decoded && decoded.exp && Date.now() < decoded.exp * 1000) {
      if (decoded.role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
