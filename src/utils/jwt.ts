import jwt from 'jsonwebtoken'; 
import { parse as parseCookie } from "cookie";

export type JwtPayload = {
  userId: string;
  username: string;
  email?: string;
  iat?: number;
  exp?: number;
};

export function parseAuthCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const cookies = parseCookie(cookieHeader);
  return cookies.authToken || null;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
