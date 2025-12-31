import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('is_admin')?.value
  
  // Nếu cố tình vào /admin mà chưa có cookie is_admin=true thì đá về /login
  if (request.nextUrl.pathname.startsWith('/admin') && isAdmin !== 'true') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: '/admin/:path*',
}