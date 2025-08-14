import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/login']
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(path)
  
  // Get the authentication token from cookies
  const authToken = request.cookies.get('amplify-authenticator-authToken')?.value
  
  // If it's not a public route and user is not authenticated, redirect to login
  if (!isPublicRoute && !authToken) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // If user is authenticated and trying to access login page, redirect to dashboard
  if (path === '/login' && authToken) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }
  
  return NextResponse.next()
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
} 