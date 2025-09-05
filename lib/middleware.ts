import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/']
  
  // API routes that should be handled by Better Auth
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }
  
  // Check if route is public
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname.startsWith('/api/newsletter') ||
                       pathname.startsWith('/api/draft-mode') ||
                       pathname.startsWith('/api/search') ||
                       pathname.startsWith('/_next') ||
                       pathname.includes('.')
  
  // For now, allow all routes to pass through - authentication will be handled client-side
  if (!isPublicRoute && pathname.startsWith('/dashboard')) {
    // We'll handle authentication on the client side for now
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}