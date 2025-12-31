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

export async function GET() {
    const user = await getUser();
    if (!user || user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = await prisma.order.aggregate({
            where: {
                createdAt: { gte: today },
                status: 'COMPLETED',
            },
            _sum: { totalAmount: true },
            _count: { id: true },
        });

        const lowStockCount = await prisma.product.count({
            where: { stock: { lte: 10 } }, // Low stock threshold 10
        });

        const lowStockProducts = await prisma.product.findMany({
            where: { stock: { lte: 10 } },
            orderBy: { stock: 'asc' },
            take: 5,
            select: { id: true, name: true, stock: true },
        });

        const totalOrders = await prisma.order.count();

        // Maybe get sales over last 7 days for chart
        // Complex query inside simplistic Prisma call is tricky, but doable.

        return NextResponse.json({
            todaySales: todayOrders._sum.totalAmount || 0,
            todayOrderCount: todayOrders._count.id,
            lowStockCount,
            lowStockProducts,
            totalOrders,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
