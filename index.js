import express from 'express';
import session from 'express-session';
import path from 'path'; // Toujours nécessaire pour __dirname si vous servez des fichiers dynamiquement ou pour d'autres opérations de chemin
import { fileURLToPath } from 'url';

// Assurez-vous que ces chemins sont corrects si vos routes sont dans un sous-dossier de 'source'
// Si elles sont directement dans 'source', alors le chemin 'src/' est correct
import eventRoutes from './src/routes/eventRoutes.js'; // Assurez-vous du .js
import guestRoutes from './src/routes/guestRoutes.js'; // Assurez-vous du .js
import authRoutes from './src/routes/authRoutes.js';   // Assurez-vous du .js
import { authMiddleware } from './src/middlewares/auth.js'; // Assurez-vous du .js

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuration des sessions
app.use(session({
    secret: 'your-secret-key', // REMPLACER PAR UNE VRAIE CLÉ SECRÈTE VIA process.env.SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Mettre à true si vous êtes en production (HTTPS)
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 heures
    }
}));

// Middleware pour parser le JSON et l'URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (seulement 'public' si vous n'avez pas d'autres besoins spécifiques)
// IMPORTANT: Vercel sert déjà 'public/' directement. Gardez ceci si vous avez des assets *autres* que ceux dans 'public'
// qui ne sont PAS servis par la route statique de Vercel.
// Dans ce cas, nous voulons que Vercel gère public. Donc, cette ligne pourrait être problématique si elle est sur /
// Cependant, pour les API, ça ne devrait pas poser de problème car les routes /api/ sont distinctes.
// Laissez-la si vous utilisez `path.join(__dirname, 'public')` dans d'autres parties de votre app pour générer des chemins,
// mais elle ne doit pas servir de contenu HTML direct si Vercel le fait déjà.

// app.use(express.static(path.join(__dirname, 'public'))); // Version plus sûre si nécessaire

// Routes API publiques
app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/guests', guestRoutes);

// Routes API admin protégées (assurez-vous que vos routes sont /api/admin/guests et non /admin/guests)
app.use('/api/admin/guests', authMiddleware, guestRoutes); // Note: si guestRoutes inclut déjà '/guests', ça devient '/api/admin/guests/guests'
app.use('/api/admin/event', authMiddleware, eventRoutes);

// ******* SUPPRIMEZ LES ROUTES HTML DIRECTES ICI *******
// Vercel servira directement index.html, login.html, dashboard.html depuis le dossier 'public'.
// NE PAS les définir dans Express.

// Gestion des erreurs 404 pour les routes API non trouvées par Express
app.use((req, res) => {
    // Si la requête arrive ici, ce n'est pas une route API définie et Vercel n'a pas trouvé de fichier statique.
    res.status(404).send('API endpoint not found or incorrect path for static file.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});