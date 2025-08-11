import jwt from 'jsonwebtoken'; 
import { parse as parseCookie } from "cookie";
import { NextRequest } from 'next/server';

export type JwtPayload = {
  userId: string;
  username: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
};

export type AuthResult = {
  success: boolean;
  payload?: JwtPayload;
  error?: string;
};

export function parseAuthCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = parseCookie(cookieHeader);
  return cookies['auth-token'] || null;
}

export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  try {
    const cookieHeader = request.headers.get('cookie');
    
    // Ensure cookieHeader is a string or null
    if (cookieHeader && typeof cookieHeader !== 'string') {
      console.error('Cookie header is not a string:', typeof cookieHeader, cookieHeader);
      return { success: false, error: 'Invalid cookie header format' };
    }
    
    const token = parseAuthCookie(cookieHeader);
    
    if (!token) {
      return { success: false, error: 'No authentication token found' };
    }
    
    const payload = verifyJwt(token);
    if (!payload) {
      return { success: false, error: 'Invalid or expired token' };
    }
    
    return { success: true, payload };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
