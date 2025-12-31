import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

export default async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't need auth
    if (pathname === '/login' || pathname === '/signup') {
        if (token) {
            try {
                const secret = new TextEncoder().encode(JWT_SECRET);
                const { payload } = await jwtVerify(token, secret);

                // Redirect based on role if already logged in
                if (payload.role === 'ADMIN') {
                    return NextResponse.redirect(new URL('/admin', request.url));
                } else {
                    return NextResponse.redirect(new URL('/pos', request.url));
                }
            } catch (e) {
                // Invalid token, let them go to login
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    // Protected routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/pos')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            const role = payload.role as string;

            // Admin routes protection
            if (pathname.startsWith('/admin')) {
                if (role !== 'ADMIN') {
                    // Redirect non-admins to POS or unauthorized page
                    return NextResponse.redirect(new URL('/pos', request.url));
                }
            }

            // POS routes - allowed for both (or strict?)
            // Usually Admins can access POS too. So we just allow authenticated users.

            return NextResponse.next();

        } catch (e) {
            // Token invalid or expired
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/pos/:path*',
        '/login',
        '/signup'
    ],
};
