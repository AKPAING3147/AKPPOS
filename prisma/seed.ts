import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    // Create or get default tenant
    const tenant = await prisma.tenant.upsert({
        where: { id: 'default-tenant-id' },
        update: {},
        create: {
            id: 'default-tenant-id',
            name: 'Demo Store',
        },
    })

    console.log({ tenant })

    const adminEmail = 'admin@example.com'
    const adminPassword = await bcrypt.hash('admin123', 10)

    // Upsert Admin with tenant
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            password: adminPassword,
            role: Role.ADMIN,
            tenantId: tenant.id,
        },
    })

    console.log({ admin })

    // Seed Categories with tenant
    const categoriesData = [
        { name: 'Beverages' },
        { name: 'Food' },
        { name: 'Snacks' },
    ]

    for (const c of categoriesData) {
        await prisma.category.upsert({
            where: {
                name_tenantId: {
                    name: c.name,
                    tenantId: tenant.id,
                }
            },
            update: {},
            create: {
                ...c,
                tenantId: tenant.id,
            },
        })
    }

    // Create default settings for tenant
    await prisma.settings.upsert({
        where: { tenantId: tenant.id },
        update: {},
        create: {
            tenantId: tenant.id,
            companyName: tenant.name,
        },
    })

    console.log('✅ Database seeded successfully!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
        await pool.end()
    })
    .catch(async (e) => {
        console.error('Error seeding database:', e)
        await prisma.$disconnect()
        await pool.end()
        process.exit(1)
    })
