const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
// des route post pour le frontend psk il envoi aussi les information
router.post('signup', userCtrl.signup);
router.post('login', userCtrl.login);


module.exports = router;