import { NextRequest, NextResponse } from "next/server"
import * as jose from 'jose';

export async function middleware(request: NextRequest) {

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string);
    const jwt = request.cookies.get('token')?.value as string;
    
    const path = request.nextUrl.pathname;

    const { payload } = await jose.jwtVerify(jwt, secret);

    if ((path.startsWith('/user') && payload?.role === 'user') || (path.startsWith('/developer') && payload?.role === 'developer')) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/denied', request.url))
  } catch (err) {
    return NextResponse.redirect(new URL('/denied', request.url))
  }
}

export const config = {
  matcher: ['/user', '/user/:path*'],
}