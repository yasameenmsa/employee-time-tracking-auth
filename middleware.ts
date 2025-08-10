import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseAuthCookie, verifyJwt } from './src/utils/jwt';

interface UserPayload {
  userId: string;
  username: string;
  email?: string;
  role?: string;
}

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': ['admin'],
  '/employee': ['employees'],
  '/hr': ['HR'],
  '/dashboard': ['admin', 'employees', 'HR'],
  '/time-tracking': ['admin', 'employees', 'HR']
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/public',
  '/public/about',
  '/public/contact'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Allow API routes to handle their own authentication
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow static files
  if (pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Get the token from cookies
  const cookieHeader = request.headers.get('cookie');
  const token = parseAuthCookie(cookieHeader);

  if (!token) {
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the JWT token
  const payload = verifyJwt(token);
  
  if (!payload) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    
    // Clear the invalid token
    response.cookies.delete('auth-token');
    
    return response;
  }
  
  // Check if the route requires specific roles
  const matchedRoute = Object.keys(protectedRoutes).find(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (matchedRoute) {
     const requiredRoles = protectedRoutes[matchedRoute as keyof typeof protectedRoutes];
     
     if (!payload.role || !requiredRoles.includes(payload.role)) {
      // Redirect to appropriate dashboard based on user role
      let redirectPath = '/dashboard';
      
      switch (payload.role) {
        case 'admin':
          redirectPath = '/admin';
          break;
        case 'employees':
          redirectPath = '/employee';
          break;
        case 'HR':
          redirectPath = '/hr';
          break;
        default:
          redirectPath = '/dashboard';
      }
      
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Add user info to headers for use in pages
  const response = NextResponse.next();
  response.headers.set('x-user-id', payload.userId);
  response.headers.set('x-user-role', payload.role || '');
  response.headers.set('x-user-username', payload.username);
  
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