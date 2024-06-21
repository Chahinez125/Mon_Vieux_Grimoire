const bycrpt = require('bcrypt')
const User = require('../models/user');
exports.signup = (req, res, next) =>{
//connecter les utilisateur existant 
bycrpt.hash(req.body.password, 10)
.then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({ error }));
  })
  .catch(error => res.status(500).json({ error }));
};
exports.login = (req, res, next) =>{
    //pour connecter les utilisateur
}