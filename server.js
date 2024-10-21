const express = require('express');
const app = express();
const { Sequelize } = require('./models');

// Middleware pour parser le JSON
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connecter à la base de données
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await Sequelize.sync();
});