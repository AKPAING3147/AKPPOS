import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { Role } from '@prisma/client';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const decoded = verifyToken(token) as any;
    if (!decoded) return null;
    return decoded;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const where: any = {
        isActive: true,
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

export async function POST(request: Request) {
    const user = await getUser();
    if (!user || user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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

        const product = await prisma.product.create({
            data: {
                name,
                categoryId,
                price: parseFloat(price),
                stock: parseInt(stock),
                barcode: barcode || null,
                image: image || null, // Convert empty string to null
                description: description || null,
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

        return NextResponse.json(product);
    } catch (error: any) {
        console.error('Product creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create product' },
            { status: 500 }
        );
    }
}
