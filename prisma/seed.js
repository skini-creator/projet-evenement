import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Créer l'événement
    const event = await prisma.event.create({
        data: {
            title: "Anniversaire",
            date: new Date("2025-05-15T19:00:00Z"),
            location: "Salle des fêtes",
            maxGuests: 50,
            description: "Venez célébrer cet événement spécial ! Places limitées."
        },
    });

    console.log('Événement créé:', event);

    // Créer un compte admin par défaut
    const hashedPassword = await bcrypt.hash('admin123', 10);
    try {
        const admin = await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword
            }
        });

        console.log('Compte admin créé:', {
            username: admin.username,
            email: admin.email
        });
    } catch (error) {
        if (error.code === 'P2002') {
            console.log('Le compte admin existe déjà');
        } else {
            throw error;
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
