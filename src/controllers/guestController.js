import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const guestController = {
    createReservation: async (req, res) => {
        try {
            const { name, email, phone, message } = req.body;

            // Vérifier si l'événement existe et s'il reste des places
            const event = await prisma.event.findFirst({
                include: {
                    _count: {
                        select: { guests: true }
                    }
                }
            });

            if (!event) {
                return res.status(404).json({ error: "Événement non trouvé" });
            }

            if (event._count.guests >= event.maxGuests) {
                return res.status(400).json({ error: "Désolé, plus de places disponibles" });
            }

            // Vérifier si l'email n'est pas déjà utilisé pour cet événement
            const existingGuest = await prisma.guest.findFirst({
                where: {
                    email,
                    eventId: event.id
                }
            });

            if (existingGuest) {
                return res.status(400).json({ error: "Vous avez déjà réservé pour cet événement" });
            }

            // Créer la réservation
            const guest = await prisma.guest.create({
                data: {
                    name,
                    email,
                    phone,
                    message,
                    eventId: event.id
                }
            });

            res.status(201).json(guest);
        } catch (error) {
            console.error('Erreur lors de la création de la réservation:', error);
            res.status(500).json({ error: "Erreur lors de la création de la réservation" });
        }
    },

    getAllGuests: async (req, res) => {
        try {
            const guests = await prisma.guest.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            res.json(guests);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des invités" });
        }
    },

    confirmGuest: async (req, res) => {
        try {
            const { id } = req.params;
            const guest = await prisma.guest.update({
                where: { id: parseInt(id) },
                data: { confirmed: true }
            });
            res.json(guest);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la confirmation de l'invité" });
        }
    },

    deleteGuest: async (req, res) => {
        try {
            const { id } = req.params;
            await prisma.guest.delete({
                where: { id: parseInt(id) }
            });
            res.json({ message: "Réservation supprimée avec succès" });
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la suppression de l'invité" });
        }
    }
};
