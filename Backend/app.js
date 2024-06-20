const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; 

const Book = require('./models/book');
const book = require('./models/book');

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

// Exemple de route POST
app.get('/api/books',async (req, res,next) => {
  Book.find()
  .then((books) => res.status(200).json(books))
  
  .catch(error => {
    res.status(400).json({ error });
});
});
app.put('/api/books/:id', (req, res, next) => {
  Book.updateOne({ _id: req.params.id },{...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié!'}))
    .catch(error => res.status(404).json({ error }));
});
app.delete('/api/books/:id', (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet supprimé!'}))
    .catch(error => res.status(404).json({ error }));
});
// Route pour récupérer un livre par son ID
app.get('/api/books/:id', (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});





module.exports = app;