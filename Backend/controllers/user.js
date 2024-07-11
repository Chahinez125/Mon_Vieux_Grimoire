const bcrypt = require("bcrypt");
const User = require("../models/user"); 
const jwt = require('jsonwebtoken');
const validator = require('validator');

// Function to validate password
const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};

exports.signup = (req, res) => {
    // Log the request body to see what is being sent
    console.log('Corps de la requête:', req.body);

    // Check if an email is provided and if it is valid
    if (!req.body.email || !validator.isEmail(req.body.email)) {
        console.log("Échec de la validation de l'email.");
        return res.status(400).json({ error: "L'e-mail fourni n'est pas valide." });
    }

    console.log("Validation de l'email réussie.");

    // Validate the password
    if (!validatePassword(req.body.password)) {
        console.log("Échec de la validation du mot de passe.");
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et avoir une longueur d'au moins 8 caractères." });
    }

    console.log("Validation du mot de passe réussie.");

    // Hash the password
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            console.log("Mot de passe haché:", hash);

            const user = new User({
                email: req.body.email,
                password: hash
            });

            console.log("Objet utilisateur créé:", user);
            return user.save();
        })
        .then(() => {
            console.log("Utilisateur enregistré avec succès.");
            res.status(201).json({ message: "Utilisateur créé" });
        })
        .catch(error => {
            console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', error);
            if (error.name === 'ValidationError') {
                console.log("Erreur de validation:", error.message);
                return res.status(400).json({ error: error.message });
            }
            console.log("Erreur inattendue:", error.message);
            return res.status(500).json({ error: error.message });
        });
};

exports.login = (req, res) => {
    console.log('Corps de la requête de connexion:', req.body);

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log("Utilisateur non trouvé.");
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }

            console.log("Utilisateur trouvé:", user);

            return bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log("Non correspondance des mots de passe.");
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }

                    console.log("Correspondance des mots de passe.");

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
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ error: error.message });
        });
};
