const jwt = require('jsonwebtoken');
exports.authenticateTokenAndRole = (roles) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log('Token manquant.');
            return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log('Token invalide ou expiré:', err);
                return res.status(403).json({ error: 'Token invalide ou expiré.' });
            }

            // Vérifier le rôle de l'utilisateur
            if (!roles.includes(user.role)) {
                return res.status(403).json({ error: 'Accès interdit. Rôle non autorisé.' });
            }

            req.user = user;
            next();
        });
    };
};