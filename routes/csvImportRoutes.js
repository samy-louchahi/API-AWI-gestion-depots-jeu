const express = require('express');
const gamesController = require('../controllers/gamesController');
const upload = require('../middleware/multer'); // Ou continue d'utiliser express-fileupload si nécessaire

const router = express.Router();

// Route pour l'importation du CSV (pas de token requis ici)
router.post('/import', upload.single('file'), gamesController.importGames);
router.get('/export', gamesController.getGamesFromCsv);
module.exports = router;