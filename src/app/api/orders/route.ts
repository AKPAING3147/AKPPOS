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

export async function POST(request: Request) {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { items, paymentMethod, totalAmount, subTotal, tax, discount, customerName } = body;

        // Validate stock first
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product || product.stock < item.quantity) {
                return NextResponse.json({ error: `Insufficient stock for product ${product?.name}` }, { status: 400 });
            }
        }

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: user.id,
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

        return NextResponse.json(order);

    } catch (error) {
        console.error('Order error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

export async function GET() {
    // Fetch orders (maybe filter by recent)
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { cashier: true, items: true },
        });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
