const express = require('express')
const app = express()
const cors = require('cors')
// Chargement des models et connexion à la DB
const db = require('./models')
db.sequelize.authenticate().then(() => console.log('Database connected...')).catch(err => console.log('Error: ' + err))

// Sync DB et seed les data obligatoires


// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Routes
require('./routes')(app)
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT} at http://localhost:${PORT}`))