const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');

// Exemple de route POST
router.post('/', bookCtrl.createBook);
  router.put('/:id', bookCtrl.modifyBook);
 router.delete('/:id', bookCtrl.deletBook);
  
  router.get('/:id', bookCtrl.getOneBook);

  router.get('/', bookCtrl.getAllBooks);

  module.exports = router;