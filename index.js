// index.js (version CommonJS)

const express = require('express'); // REMPLACE import express from 'express';
const session = require('express-session'); // REMPLACE import session from 'express-session';
// const path = require('path'); // Supprimez si non utilisé
// const { fileURLToPath } = require('url'); // Supprimez si non utilisé

// Remplacez les imports de vos modules locaux par require()
// ET IMPORTANT : Supprimez le ".js" pour les fichiers locaux si vous n'avez pas de configuration spécifique
// de résolution d'extension pour CommonJS. Node.js les trouvera sans le .js dans CommonJS.
// Cependant, il est plus sûr de laisser le .js pour la clarté si les fichiers sont vraiment .js
const eventRoutes = require('./src/routes/eventRoutes.js');
const guestRoutes = require('./src/routes/guestRoutes.js');
const authRoutes = require('./src/routes/authRoutes.js');
const { authMiddleware } = require('./src/middlewares/auth.js');


// Supprimez ces lignes si vous ne les utilisez plus après avoir retiré les res.sendFile
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();

// Le reste de votre configuration Express reste le même
// ... (configuration des sessions, middlewares, routes API) ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});