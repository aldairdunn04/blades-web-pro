import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 1. Content Security Policy (CSP) - Hardened
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.cartocdn.com https://basemaps.cartocdn.com;
    img-src 'self' blob: data: https://lh3.googleusercontent.com https://www.gstatic.com https://firebasestorage.googleapis.com https://*.cartocdn.com https://basemaps.cartocdn.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' blob: https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com https://*.cartocdn.com https://basemaps.cartocdn.com;
    frame-src 'self' https://*.firebaseapp.com https://challenges.cloudflare.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // 2. Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // 3. Basic IP Logging (Para auditoría de seguridad)
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  response.headers.set('X-Blades-Security-Trace', Buffer.from(ip).toString('base64'));

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
