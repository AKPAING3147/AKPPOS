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
        const products = await prisma.product.findMany({
            where: { stock: { lte: 10 } },
            orderBy: { stock: 'asc' },
            include: { category: true },
        });

        // Generate CSV
        const csvHeader = 'ID,Name,Category,Price,Stock,Barcode\n';
        const csvRows = products.map(p => {
            const escape = (text: string) => `"${text ? text.replace(/"/g, '""') : ''}"`;
            return [
                p.id,
                escape(p.name),
                escape(p.category.name),
                p.price,
                p.stock,
                escape(p.barcode || ''),
            ].join(',');
        }).join('\n');

        const csvContent = csvHeader + csvRows;

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="low-stock-report-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Report generation error:', error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
