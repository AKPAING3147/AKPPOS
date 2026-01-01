import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/tenant';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    try {
        const product = await prisma.product.findFirst({
            where: {
                id,
                tenantId: user.tenantId // Verify ownership
            },
            include: { category: true }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = await context.params;

    try {
        const body = await request.json();
        const { name, categoryId, price, stock, barcode, image, description, isActive } = body;

        // Fetch old product and verify tenant ownership
        const oldProduct = await prisma.product.findFirst({
            where: {
                id,
                tenantId: user.tenantId
            }
        });

        if (!oldProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // If changing category, verify new category belongs to tenant
        if (categoryId && categoryId !== oldProduct.categoryId) {
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
        }

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

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { id } = await context.params;

    try {
        // Verify product belongs to tenant before deleting
        const product = await prisma.product.findFirst({
            where: {
                id,
                tenantId: user.tenantId
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
