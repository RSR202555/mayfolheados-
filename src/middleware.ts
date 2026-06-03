import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const jwtSecret = process.env.JWT_SECRET || 'may-folheados-super-secret-jwt-key-2026';

  // 1. Protect Admin Panel UI Routes (e.g., /admin, /admin/products but not /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionCookie = request.cookies.get('admin_session');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyJWT(sessionCookie.value, jwtSecret);
    if (!payload) {
      // Session invalid or expired - redirect to login and clear cookie
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // 2. Protect Admin Writing API Endpoints (POST, PUT, DELETE for products, and all for migrate)
  if (pathname.startsWith('/api/products') || pathname.startsWith('/api/migrate')) {
    const method = request.method;
    
    // We protect write operations (POST, PUT, DELETE) on products, and all requests to migrate
    const isProtected = ['POST', 'PUT', 'DELETE'].includes(method) || pathname.startsWith('/api/migrate');

    if (isProtected) {
      const sessionCookie = request.cookies.get('admin_session');
      
      if (!sessionCookie) {
        return NextResponse.json({ error: 'Acesso não autorizado. Sessão ausente.' }, { status: 401 });
      }

      const payload = await verifyJWT(sessionCookie.value, jwtSecret);
      if (!payload) {
        return NextResponse.json({ error: 'Acesso não autorizado. Sessão inválida ou expirada.' }, { status: 401 });
      }
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware runs on
export const config = {
  matcher: ['/admin/:path*', '/api/products/:path*', '/api/migrate/:path*'],
};
