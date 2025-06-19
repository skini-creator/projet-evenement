import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Vérifier si l'utilisateur existe déjà
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username },
                        { email }
                    ]
                }
            });

            if (existingUser) {
                if (existingUser.email === email) {
                    return res.status(400).json({ error: "Cet email est déjà utilisé" });
                }
                return res.status(400).json({ error: "Ce nom d'utilisateur est déjà pris" });
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer l'utilisateur
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword
                }
            });

            // Générer le token JWT
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({ token });
        } catch (error) {
            console.error('Erreur lors de l inscription:', error);
            res.status(500).json({ error: "Erreur lors de l'inscription" });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Trouver l'utilisateur par email
            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(401).json({ error: "Email ou mot de passe incorrect" });
            }

            // Vérifier le mot de passe
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: "Email ou mot de passe incorrect" });
            }

            // Configurer la session
            req.session.isAuthenticated = true;
            req.session.userId = user.id;
            req.session.username = user.username;

            res.json({ success: true });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ error: "Erreur lors de la connexion" });
        }
    },

    logout: async (req, res) => {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ error: "Erreur lors de la déconnexion" });
            }
            res.json({ success: true });
        });
    }
};
