const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types; 

const Book = require('./models/book');

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

// Route pour récupérer un livre par son ID
app.get('api/books/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findOne(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Aucun livre trouvé avec cet ID' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error('Erreur lors de la recherche du livre par ID:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la recherche du livre' });
  }
});





module.exports = app;