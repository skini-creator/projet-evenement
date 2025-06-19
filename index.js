import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import eventRoutes from './src/routes/eventRoutes.js';
import guestRoutes from './src/routes/guestRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import { authMiddleware } from './src/middlewares/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration des sessions
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Mettre à true si vous utilisez HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use(express.static('public'));
app.use(express.static('views'));

// Routes publiques
app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes); // Route publique pour les stats
app.use('/api/guests', guestRoutes); // Route publique pour la réservation

// Route pour servir le fichier login.html
app.get('/admin/login.html', (req, res) => {
    if (req.session.isAuthenticated) {
        res.redirect('/admin');
        return;
    }
    res.sendFile(path.join(__dirname, 'views', 'admin', 'login.html'));
});

// Route pour le dashboard admin (protégée)
app.get('/admin', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin', 'dashboard.html'));
});

// Routes admin protégées
app.use('/api/admin/guests', authMiddleware, guestRoutes);
app.use('/api/admin/event', authMiddleware, eventRoutes);

// Route pour la page d'accueil (publique)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).send('Page non trouvée');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
