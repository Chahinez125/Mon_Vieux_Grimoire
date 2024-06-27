/*const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require('jsonwebtoken');
const validator = require('validator');

/*exports.signup = (req, res, next) =>{
    console.log('Request Body:', req.body);

   
  bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email : req.body.email,
                password : hash
            });
            user.save()
            .then(()=> res.status(201).json({message:"User cree"}))
            .catch(error => res.status(400).json({error}))
        })
        
        .catch(error => res.status(500).json({error}))
};*/
/*exports.signup = (req, res, next) => {
    // Vérifier si un e-mail est fourni et s'il correspond à un format valide
    if (!req.body.email || !validator.isEmail(req.body.email)) {
        return res.status(400).json({ error: "L'e-mail fourni n'est pas valide." });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token:  jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' })
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };*/


 /*const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const validator = require('validator');


exports.signup = (req, res, next) => {
    // Vérifier si un e-mail est fourni et s'il correspond à un format valide
    if (!req.body.email || !validator.isEmail(req.body.email)) {
        return res.status(400).json({ error: "L'e-mail fourni n'est pas valide." });
    }
    //res.send("Sign Up")

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token:  jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' })
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };*/
 const bcrypt = require("bcrypt");
const User = require("../models/user"); // Corrected line
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.signup = (req, res, next) => {
    // Log the request body to see what is being sent
    console.log('Request Body:', req.body);

    // Check if an email is provided and if it is valid
    if (!req.body.email || !validator.isEmail(req.body.email)) {
        console.log("Email validation failed.");
        return res.status(400).json({ error: "L'e-mail fourni n'est pas valide." });
    }

    console.log("Email validation passed.");

    // Hash the password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log("Password hashed:", hash);

            const user = new User({
                email: req.body.email,
                password: hash
            });

            console.log("User object created:", user);
            return user.save();
        })
        .then(() => {
            console.log("User saved successfully.");
            res.status(201).json({ message: "Utilisateur créé" });
        })
        .catch(error => {
            console.error('Error saving user:', error);
            if (error.name === 'ValidationError') {
                console.log("Validation error:", error.message);
                return res.status(400).json({ error: error.message });
            }
            console.log("Unexpected error:", error.message);
            return res.status(500).json({ error: error.message });
        });
};

exports.login = (req, res, next) => {
    console.log('Login Request Body:', req.body);

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log("User not found.");
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }

            console.log("User found:", user);

            return bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log("Password mismatch.");
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }

                    console.log("Password match.");

                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                });
        })
        .catch(error => {
            console.error('Error during login:', error);
            res.status(500).json({ error: error.message });
        });
};
