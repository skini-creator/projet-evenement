import express from 'express';
import { guestController } from '../controllers/guestController.js';
const router = express.Router();

// Route publique pour la réservation
router.post('/', guestController.createReservation);

// Routes admin protégées
router.get('/', guestController.getAllGuests);
router.put('/:id/confirm', guestController.confirmGuest);
router.delete('/:id', guestController.deleteGuest);

export default router;
