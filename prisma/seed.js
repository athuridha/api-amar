
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding admin user...');

    // Credentials provided by user
    const username = 'athuridha';
    const password = 'Amar130803@';

    // Hash password with SHA-256 (same as in login route)
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Upsert admin user
    const admin = await prisma.admin.upsert({
        where: { username: username },
        update: {
            password_hash: passwordHash
        },
        create: {
            username: username,
            password_hash: passwordHash
        }
    });

    console.log(`Admin user '${admin.username}' created/updated successfully.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
