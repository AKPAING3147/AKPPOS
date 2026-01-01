import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/tenant';

export async function POST(request: NextRequest) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { items, paymentMethod, totalAmount, subTotal, tax, discount, customerName } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
        }

        // Validate stock and tenant ownership
        for (const item of items) {
            const product = await prisma.product.findFirst({
                where: {
                    id: item.productId,
                    tenantId: user.tenantId // Verify product belongs to tenant
                }
            });

            if (!product) {
                return NextResponse.json({
                    error: `Product not found or does not belong to your organization`
                }, { status: 404 });
            }

            if (product.stock < item.quantity) {
                return NextResponse.json({
                    error: `Insufficient stock for product ${product.name}`
                }, { status: 400 });
            }
        }

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: user.id,
                    tenantId: user.tenantId, // Auto-assign tenant
                    paymentMethod,
                    totalAmount,
                    subTotal,
                    tax,
                    discount,
                    customerName,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
                include: { items: true },
            });

            // Update Stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });

                await tx.inventoryLog.create({
                    data: {
                        productId: item.productId,
                        type: 'SALE',
                        quantity: -item.quantity,
                        reason: `Order ${newOrder.id}`,
                    },
                });
            }

            return newOrder;
        });

        return NextResponse.json(order, { status: 201 });

    } catch (error) {
        console.error('Order error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { tenantId: user.tenantId }, // Filter by tenant
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { cashier: true, items: true },
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
