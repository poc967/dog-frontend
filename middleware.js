import { NextResponse } from 'next/server';

export function middleware(request) {
  // Block POST to root — this page has no server action, bots spam it with junk payloads
  if (request.method === 'POST' && request.nextUrl.pathname === '/') {
    return new NextResponse(null, { status: 405 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
