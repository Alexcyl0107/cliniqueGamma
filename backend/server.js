const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion Base de Données
const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinique-gamma';

mongoose.connect(DB)
  .then(() => console.log('✅ Connexion MongoDB réussie'))
  .catch(err => console.error('❌ Erreur connexion MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('Serveur API Clinique Gamma actif 🚀');
});

// Gestion des erreurs 404
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Impossible de trouver ${req.originalUrl} sur ce serveur!`
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}...`);
});