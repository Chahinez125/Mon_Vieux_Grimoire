const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const book = require('./models/book')

require('dotenv').config(); // Charger les variables d'environnement à partir du fichier .env
// Utiliser la variable d'environnement pour l'URL de MongoDB
const mongoDBUri = process.env.MONGODB_URI;

mongoose.connect(mongoDBUri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// Définir une route de base
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Exemple de route POST
app.get('/api/books', (req, res, next) => {
  book.find()
  .then((books) => res.status(200).json(books))
  
  .catch(error => {
    res.status(400).json({ error });
});
});

module.exports = app;