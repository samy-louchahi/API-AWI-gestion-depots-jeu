// controllers/gameController.js

const { Game, DepositGame, Stock, Seller } = require('../models');
const fs = require('fs');
const csvParser = require('csv-parser');

module.exports = {
  /**
   * CREATE: POST /api/games
   * Body attendu: { name, publisher }
   */
  async createGame(req, res) {
    try {
      const { name, publisher, description } = req.body;
      
      if (!name || !publisher) {
        return res.status(400).json({ error: 'Missing required fields: name, publisher' });
      }
      // Si un fichier a été uploadé, utiliser son chemin pour la propriété "picture"
      let pictureUrl = req.body.picture; // Valeur par défaut (par exemple une URL déjà renseignée)
      if (req.file) {
          // Utilisez le port 3000 qui correspond à votre backend
          pictureUrl = `http://localhost:3000/games-pictures/${req.file.filename}`;
      }

      // Création du jeu avec l'URL de l'image
      const newGame = await Game.create({ name, publisher, description, picture: pictureUrl });

      return res.status(201).json(newGame);
    } catch (error) {
      console.error('Erreur lors de la création du jeu:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ALL: GET /api/games
   * Récupérer la liste de tous les jeux, avec leurs relations si nécessaire
   */
  async findAllGames(req, res) {
    try {
      const games = await Game.findAll({
        include: [
          { model: DepositGame }, // Inclure les associations avec DepositGame
          // Ajoute d'autres inclusions si nécessaire
        ]
      });
      return res.json(games);
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * READ ONE: GET /api/games/:id
   */
  async findGameById(req, res) {
    try {
      const { id } = req.params;
      const game = await Game.findByPk(id, {
        include: [
          { model: DepositGame, as: 'depositGames' }, // Inclure les associations avec DepositGame
          // Ajoute d'autres inclusions si nécessaire
        ]
      });
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      return res.json(game);
    } catch (error) {
      console.error('Erreur lors de la récupération du jeu:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * UPDATE: PUT /api/games/:id
   * Body possible: { name, publisher }
   */
  async updateGame(req, res) {
    try {
      const { id } = req.params;
      const { name, publisher, description } = req.body;

      // Récupérer le jeu
      const game = await Game.findByPk(id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      if (req.file) {
        // Utilisez le port 3000 qui correspond à votre backend
        game.pictureUrl = `http://localhost:3000/games-pictures/${req.file.filename}`;
      } else if (req.body.picture) {
        // Sinon, conserver ou mettre à jour la valeur déjà existante
        game.picture = req.body.picture;
      }
      
      if (name !== undefined) {
        game.name = name;
      }
      if (publisher !== undefined) {
        game.publisher = publisher;
      }
      if (description !== undefined) {
        game.description = description;
      }

      await game.save();

      return res.json(game);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du jeu:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  async importGames(req, res) {
    try {
        // Vérifie qu'un fichier a bien été uploadé
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier fourni.' });
        }

        const csvFile = req.file; // Le fichier uploadé
        const tempPath = csvFile.path; // Chemin temporaire généré par Multer

        const results = [];

        // Lire le CSV
        fs.createReadStream(tempPath)
            .pipe(csvParser({ headers: ['name', 'publisher', 'description', 'picture'] }))
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', async () => {
                try {
                    for (const game of results) {
                        if (!game.name || !game.publisher || !game.description || !game.picture) {
                            return res.status(400).json({ error: 'Données de jeu manquantes dans le CSV.' });
                        }
                        await Game.create({
                            name: game.name,
                            publisher: game.publisher,
                            description: game.description,
                            picture: game.picture,
                        });
                    }

                    // Supprime le fichier temporaire
                    fs.unlink(tempPath, (err) => {
                        if (err) console.error('Erreur lors de la suppression du fichier temporaire :', err);
                    });

                    return res.status(201).json({ message: 'Jeux importés avec succès.' });
                } catch (dbError) {
                    console.error('Erreur lors de l\'insertion en base de données :', dbError);
                    return res.status(500).json({ error: 'Erreur lors de l\'insertion des jeux.' });
                }
            });
    } catch (err) {
        console.error('Erreur lors de l\'importation :', err);
        return res.status(500).json({ error: 'Erreur lors du traitement du fichier.' });
    }
  },
  async getGamesFromCsv(req, res) {
    try {
        // Vérifie qu'un fichier a bien été uploadé
        if (!req.file) {
          return res.status(400).json({ error: 'Aucun fichier fourni.' });
      }
      
      const csvFile = req.file; // Récupération correcte du fichier
      const tempPath = csvFile.path; // Chemin du fichier temporaire

        // Sauvegarde temporairement le fichier
        await csvFile.mv(tempPath);

        const results = [];

        // Lire le CSV
        fs.createReadStream(tempPath)
            .pipe(csvParser({ headers: ['name', 'publisher', 'description', 'picture'] }))
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', async () => {
                // Supprime le fichier temporaire
                fs.unlink(tempPath, (err) => {
                    if (err) console.error('Erreur lors de la suppression du fichier temporaire :', err);
                });

                return res.status(200).json(results);
            });
    } catch (err) {
        console.error('Erreur lors de la récupération du fichier :', err);
        return res.status(500).json({ error: 'Erreur lors du traitement du fichier.' });
    }
  },

  /**
   * DELETE: DELETE /api/games/:id
   */
  async deleteGame(req, res) {
    try {
      const { id } = req.params;
      const game = await Game.findByPk(id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      // Supprimer l'image du jeu si elle existe
      if (game.picture) {
        const picturePath = game.picture.split('/games-pictures/')[1];
        fs.unlink(`games-pictures/${picturePath}`, (err) => {
          if (err) console.error('Erreur lors de la suppression de l\'image:', err);
        });
      }
      // Optionnel: vérifier s'il existe des DepositGame liés
      // Par exemple, empêcher la suppression si des associations existent
      const associatedDepositGames = await DepositGame.findAll({ where: { game_id: id } });
      if (associatedDepositGames.length > 0) {
        return res.status(400).json({ error: 'Cannot delete game with associated deposit games' });
      }

      await game.destroy();
      return res.json({ message: 'Game deleted successfully' });
    } catch (error) {
      console.error('Erreur lors de la suppression du jeu:', error);
      return res.status(500).json({ error: error.message });
    }
  },
  async getGameStocks(req, res) {
    const gameId = req.params.id;

    try {
        // Vérifier si le jeu existe
        const game = await Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Jeu non trouvé.' });
        }

        // Récupérer tous les stocks associés à ce jeu, incluant les informations sur les vendeurs
        const stocks = await Stock.findAll({
          where: { game_id: gameId },
          include: [
            { model: Seller, attributes: ['seller_id', 'name'] }
          ]
        });

        res.status(200).json(stocks);
    } catch (error) {
        console.error('Erreur dans getGameStocks:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des stocks du jeu.' });
    }
  }
};