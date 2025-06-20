import express from 'express';
import session from 'express-session';
// path et fileURLToPath ne sont plus nécessaires si vous ne servez plus de fichiers locaux directement
// import path from 'path';
// import { fileURLToPath } from 'url';

import eventRoutes from './src/routes/eventRoutes.js';
import guestRoutes from './src/routes/guestRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { authMiddleware } from './src/middlewares/auth.js';

// const __filename = fileURLToPath(import.meta.url); // Plus nécessaire
// const __dirname = path.dirname(__filename); // Plus nécessaire

const app = express();

// Configuration des sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-fallback-secret-key', // Utiliser une variable d'environnement
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Mettre à true si vous utilisez HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AUCUNE LIGNE app.use(express.static(...)) ici !
// AUCUNE ROUTE app.get('/', ...) ou app.get('/admin/login.html', ...) qui envoie des fichiers HTML.

// Routes API publiques
app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/guests', guestRoutes);

// Routes admin protégées (assurez-vous que vos routes sont /api/admin/guests et non /admin/guests)
app.use('/api/admin/guests', authMiddleware, guestRoutes);
app.use('/api/admin/event', authMiddleware, eventRoutes);

// Gestion des erreurs 404 pour les routes API non trouvées par Express
app.use((req, res) => {
    res.status(404).send('API endpoint not found.'); // Message plus spécifique
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});