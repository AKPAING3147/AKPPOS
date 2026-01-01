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
        let settings = await prisma.settings.findUnique({
            where: { tenantId: user.tenantId }
        });

        // Create default settings for tenant if none exist
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    tenantId: user.tenantId,
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

export async function PUT(request: NextRequest) {
    const user = await getUserFromRequest(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { companyName, companyAddress, companyPhone, companyEmail, companyLogo, taxRate, currency } = body;

        // Get or create settings for this tenant
        let settings = await prisma.settings.findUnique({
            where: { tenantId: user.tenantId }
        });

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
            // Create new for this tenant
            settings = await prisma.settings.create({
                data: {
                    tenantId: user.tenantId,
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
