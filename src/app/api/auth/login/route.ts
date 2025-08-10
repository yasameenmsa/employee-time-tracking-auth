import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { UserService } from "@/utils/userService";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Authenticate user with MongoDB
    const user = await UserService.authenticateUser(username, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET || '',
      { expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 3600 }
    );

    // Set an HttpOnly Cookie (security attribute)
    const response = NextResponse.json({ 
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable HTTPS in the production environment
      sameSite: "lax", // Prevent CSRF attacks
      maxAge: Number(process.env.JWT_EXPIRES_IN) || 3600,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
