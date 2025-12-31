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
    try {
        let settings = await prisma.settings.findFirst();

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    companyName: 'MGYPOS',
                    companyAddress: '123 Business Street, City, State 12345',
                    companyPhone: '(555) 123-4567',
                    taxRate: 0.10,
                    currency: 'USD',
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const user = await getUser();
    if (!user || user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { companyName, companyAddress, companyPhone, companyEmail, companyLogo, taxRate, currency } = body;

        // Get or create settings
        let settings = await prisma.settings.findFirst();

        if (settings) {
            // Update existing
            settings = await prisma.settings.update({
                where: { id: settings.id },
                data: {
                    companyName,
                    companyAddress,
                    companyPhone,
                    companyEmail,
                    companyLogo,
                    taxRate: taxRate ? parseFloat(taxRate) : undefined,
                    currency,
                },
            });
        } else {
            // Create new
            settings = await prisma.settings.create({
                data: {
                    companyName,
                    companyAddress,
                    companyPhone,
                    companyEmail,
                    companyLogo,
                    taxRate: parseFloat(taxRate),
                    currency,
                },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
