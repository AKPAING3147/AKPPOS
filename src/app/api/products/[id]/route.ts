import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const decoded = verifyToken(token) as any;
    if (!decoded) return null;
    return decoded;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    const user = await getUser();
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await context.params;

    try {
        const body = await request.json();
        const { name, categoryId, price, stock, barcode, image, description, isActive } = body;

        // Fetch old product for stock comparison
        const oldProduct = await prisma.product.findUnique({ where: { id } });
        if (!oldProduct) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                categoryId,
                price: parseFloat(price),
                stock: parseInt(stock),
                barcode: barcode || null,
                image: image,
                description: description,
                isActive: isActive !== undefined ? isActive : oldProduct.isActive,
            }
        });

        // Log Stock Change
        const newStock = parseInt(stock);
        if (newStock !== oldProduct.stock) {
            const diff = newStock - oldProduct.stock;
            await prisma.inventoryLog.create({
                data: {
                    productId: id,
                    type: diff > 0 ? 'RESTOCK' : 'ADJUSTMENT',
                    quantity: Math.abs(diff),
                    reason: diff > 0 ? 'Manual Restock' : 'Manual Adjustment',
                }
            });
        }

        return NextResponse.json(updatedProduct);

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    const user = await getUser();
    if (!user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { id } = await context.params;
    try {
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
