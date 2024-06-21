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
    User.findOne({ email: req.body.email })
    .then(user => {   //si elle est null 
        if (!user){
            return res.status(401).json({ message: 'paire identifiant/mot de passe incorrecte' });
            } else{
                bycrpt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid){
                        return res.status(401).json({ message: 'paire identifiant/mot de passe incorrecte'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: 'TOKEN'
                        });
                    }) 
                    .catch(error => res.status(500).json({ error }));
                    }
                    })
                    .catch(error => res.status(500).json({ error }));

                };