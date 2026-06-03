import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const jwtSecret = process.env.JWT_SECRET || 'may-folheados-super-secret-jwt-key-2026';

    if (username === expectedUsername && password === expectedPassword) {
      // Create session payload
      const token = await signJWT({ username }, jwtSecret, 24);

      // Create response
      const response = NextResponse.json({ success: true });

      // Set session cookie
      response.cookies.set({
        name: 'admin_session',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 86400, // 24 hours
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Usuário ou senha incorretos.' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 }
    );
  }
}
