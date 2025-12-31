
import "dotenv/config";
import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function test() {
    try {
        const email = `test-${Date.now()}@example.com`;
        const hashedPassword = await bcrypt.hash('Password123!', 12);
        const user = await prisma.user.create({
            data: {
                name: 'Test User',
                email: email,
                password: hashedPassword,
                role: 'STAFF',
            }
        });
        console.log('User created:', user.email);
        process.exit(0);
    } catch (error: any) {
        console.error('Create error:', error);
        if (error.cause) console.error('Error cause:', error.cause);
        process.exit(1);
    }
}

test();
