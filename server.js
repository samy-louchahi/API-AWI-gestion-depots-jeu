require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cron = require('node-cron'); // Ajoute cette ligne
const updateSessionStatus = require('./task/updateSessionStatus');
const { Op } = require('sequelize');

// Chargement des models et connexion à la DB
const db = require('./models');
db.sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Planifier la tâche pour qu'elle s'exécute toutes les heures
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled task: updateSessionStatus');
    updateSessionStatus();
});

// Optionnellement, exécuter la tâche au démarrage du serveur
updateSessionStatus();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const path = require('path');
app.use('/games-pictures', express.static(path.join(__dirname, 'games-pictures')));
// Routes
require('./routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} at http://localhost:${PORT}`));