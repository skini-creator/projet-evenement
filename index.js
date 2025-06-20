const express = require('express');
const app = express();

// Supprimez TOUT le code lié aux sessions, Prisma, routes, middlewares, etc.
// Laissez juste une route de test simple
app.get('/api/test', (req, res) => {
    res.status(200).json({ message: 'API test working!' });
});

// Gestion des erreurs 404 (simple)
app.use((req, res) => {
    res.status(404).send('Not Found - Simplified Express');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Simplified Express server started on port ${PORT}`);
});