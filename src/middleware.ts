import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Simple check for Firebase session cookie or token in headers/cookies.
  // Full validation would typically be done in the API routes using firebase-admin.
  const session = request.cookies.get('mentora_session');
  
  // Example basic protection for /dashboard routes:
  if (request.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const response = NextResponse.next();
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  return response;
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
