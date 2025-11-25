const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Testing database connection...');
        const result = await prisma.$executeRaw`SELECT 1`;
        console.log('✓ Database connection successful!');

        // Count users
        const userCount = await prisma.user.count();
        console.log(`✓ Found ${userCount} users in database`);

        await prisma.$disconnect();
    } catch (error) {
        console.error('✗ Database connection failed:');
        console.error(error.message);
        process.exit(1);
    }
}

test();