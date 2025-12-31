
import "dotenv/config";
import { prisma } from './src/lib/prisma';

async function test() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users count:', users.length);
        process.exit(0);
    } catch (error: any) {
        console.error('Connection error:', error);
        if (error.cause) console.error('Error cause:', error.cause);
        process.exit(1);
    }
}

test();
