import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const eventController = {
    getEvent: async (req, res) => {
        try {
            const event = await prisma.event.findFirst({
                include: {
                    _count: {
                        select: { guests: true }
                    }
                }
            });

            if (!event) {
                return res.status(404).json({ error: "Aucun événement trouvé" });
            }

            res.json(event);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération de l'événement" });
        }
    },

    getEventStats: async (req, res) => {
        try {
            const event = await prisma.event.findFirst({
                include: {
                    _count: {
                        select: { guests: true }
                    }
                }
            });

            if (!event) {
                return res.status(404).json({ error: "Aucun événement trouvé" });
            }

            const stats = {
                totalPlaces: event.maxGuests,
                reservations: event._count.guests,
                placesRestantes: event.maxGuests - event._count.guests
            };

            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
        }
    }
};
