import { NextResponse } from 'next/server';
import { parseAuthCookie, verifyJwt } from '@/utils/jwt';
import { UserService } from '@/utils/userService';

export async function GET(request: Request) {
  try {
    const token = parseAuthCookie(request.headers.get('cookie'));
    const payload = token ? verifyJwt(token) : null;

    if (!payload) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // Get fresh user data from MongoDB
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      userId: user.id,
      username: user.username,
      email: user.email
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}