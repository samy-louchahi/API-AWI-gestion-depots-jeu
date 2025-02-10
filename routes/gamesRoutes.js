// Dans votre fichier de routes (ex: gamesRoutes.js)
const express = require('express');
const multer  = require('multer');
const gamesController = require('../controllers/gamesController');
const { authenticateTokenAndRole } = require('../middleware/authMiddleware');

const router = express.Router();
const path = require('path');
const uploadDir = path.join(__dirname, '..', 'games-pictures');
// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,uploadDir); // Assurez-vous que ce dossier existe et est accessible
  },
  filename: (req, file, cb) => {
    // Par exemple, préfixer le nom du fichier avec la date
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });
const fs = require('fs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Appliquer la vérification des rôles
router.use(authenticateTokenAndRole(['admin', 'gestionnaire']));

// Pour la création et la mise à jour, utiliser Multer pour traiter le champ "picture"
router.post('/', upload.single('picture'), gamesController.createGame);
router.put('/:id', upload.single('picture'), gamesController.updateGame);

// Les autres routes restent inchangées
router.get('/', gamesController.findAllGames);
router.get('/:id', gamesController.findGameById);
router.delete('/:id', gamesController.deleteGame);
router.get('/:id/stocks', gamesController.getGameStocks);

module.exports = router;