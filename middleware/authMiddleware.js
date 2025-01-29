const jwt = require('jsonwebtoken');

// Middleware pour authentifier le token
exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) {
        console.log('Token manquant.');
        return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token invalide ou expiré:', err);
            return res.status(403).json({ error: 'Token invalide ou expiré.' });
        }
        console.log('Token valide pour l\'utilisateur:', user);
        req.user = user; // user contient id, email ou username, role
        next();
    });
};

// Middleware pour autoriser des rôles spécifiques
exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        console.log(`Autorisation requise pour les rôles: ${roles}, rôle de l'utilisateur: ${req.user.role}`);
        if (!roles.includes(req.user.role)) {
            console.log(`Rôle ${req.user.role} non autorisé.`);
            return res.status(403).json({ error: 'Accès interdit. Vous n\'avez pas les permissions nécessaires.' });
        }
        next();
    };
};