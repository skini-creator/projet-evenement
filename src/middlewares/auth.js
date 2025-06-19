export const authMiddleware = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        if (req.xhr || req.headers.accept?.includes('json')) {
            return res.status(401).json({ error: 'Non authentifié' });
        }
        return res.redirect('/admin/login.html');
    }
    next();
};
