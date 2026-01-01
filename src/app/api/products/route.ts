import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/tenant';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
    // Get tenant context from JWT
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const where: any = {
        isActive: true,
        tenantId: user.tenantId, // Filter by tenant
    };

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { barcode: { contains: search } },
        ];
    }

    try {
        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
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
        const { name, categoryId, price, stock, barcode, image, description } = body;

        // Validate required fields
        if (!name || !categoryId || !price || stock === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: name, categoryId, price, stock' },
                { status: 400 }
            );
        }

        // Verify category belongs to same tenant
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                tenantId: user.tenantId
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found or does not belong to your organization' },
                { status: 404 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                categoryId,
                price: parseFloat(price),
                stock: parseInt(stock),
                barcode: barcode || null,
                image: image || null,
                description: description || null,
                tenantId: user.tenantId, // Auto-assign tenant
            },
        });

        // Log inventory
        await prisma.inventoryLog.create({
            data: {
                productId: product.id,
                type: 'INITIAL',
                quantity: parseInt(stock),
                reason: 'Initial stock',
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        console.error('Product creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
