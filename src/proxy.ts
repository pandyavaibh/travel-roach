import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE } from '@/lib/constants';

/**
 * Thin routing layer only: does a session cookie exist. This is deliberate —
 * Next 16 moved auth out of this boundary, so the authoritative role check
 * happens in each page via requireStaff / requireOwner, which can reach the
 * database. A cookie here is a hint, never a permission.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = req.cookies.has(SESSION_COOKIE);

  const isAuthPage = pathname === '/admin/login' || pathname === '/portal/login'
    || pathname.startsWith('/portal/signup') || pathname.startsWith('/portal/reset');

  if (!hasSession && !isAuthPage && (pathname.startsWith('/admin') || pathname.startsWith('/portal'))) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.startsWith('/admin') ? '/admin/login' : '/portal/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/portal/:path*'] };
