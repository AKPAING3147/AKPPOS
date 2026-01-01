import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/tenant';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const categories = await prisma.category.findMany({
            where: { tenantId: user.tenantId }, // Filter by tenant
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name } = body;

        if (!name || name.trim() === '') {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                tenantId: user.tenantId // Auto-assign tenant
            },
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error: any) {
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
