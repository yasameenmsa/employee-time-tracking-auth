import { NextRequest, NextResponse } from 'next/server';
import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { UserService } from '@/utils/userService';

export async function GET(request: NextRequest) {
  try {
    // Force recompilation
    // Get the authentication token from cookies
    const cookieHeader = request.headers.get('cookie');
    const token = parseAuthCookie(cookieHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user data from database
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data (excluding password)
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}