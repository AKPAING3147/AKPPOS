import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

console.log('--- REGISTER ROUTE LOADED ---');

// Password strength validation
function validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least one number' };
    }

    return { valid: true };
}

// Email validation
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(request: Request) {
    try {
        console.log('Registration attempt started');
        const body = await request.json();
        const { name, email, password, confirmPassword } = body;

        // Input validation
        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Name validation
        if (name.trim().length < 2) {
            return NextResponse.json(
                { error: 'Name must be at least 2 characters long' },
                { status: 400 }
            );
        }

        // Email validation
        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Password match validation
        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        // Password strength validation
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: passwordValidation.message },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 409 }
            );
        }

        // Hash password with bcrypt (salt rounds: 12 for high security)
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('Password hashed successfully');

        // Create user (default role: STAFF, admins are created manually)
        console.log('Creating user in DB...');
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: Role.STAFF, // Default role
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Account created successfully',
                user,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error details:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json(
            { error: `[V2] Registration error: ${error.message}` },
            { status: 500 }
        );
    }
}
