import 'dotenv/config'
import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const adminEmail = 'admin@example.com'
    const adminPassword = await bcrypt.hash('admin123', 10)

    // Upsert Admin
    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            password: adminPassword,
            role: Role.ADMIN,
        },
    })

    console.log({ admin })

    // Seed Categories
    const categoriesData = [
        { name: 'Beverages' },
        { name: 'Food' },
        { name: 'Snacks' },
    ]

    for (const c of categoriesData) {
        await prisma.category.upsert({
            where: { name: c.name },
            update: {},
            create: c,
        })
    }

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
