const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const booksRouters = require('./routes/book');
const userRoutes = require('./routes/user')


require('dotenv').config(); 
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
// Middleware pour parser les données URL-encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/books', booksRouters);
app.use('/api/auth', userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));





module.exports = app;