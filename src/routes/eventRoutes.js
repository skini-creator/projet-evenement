import express from 'express';
import { eventController } from '../controllers/eventController.js';
const router = express.Router();

// Route publique pour les statistiques
router.get('/stats', eventController.getEventStats);

// Routes admin protégées
router.get('/', eventController.getEvent);

export default router;
