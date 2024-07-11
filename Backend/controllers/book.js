const Book = require("../models/Book");
const fs = require('fs');

exports.createBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject.userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/optimized_${req.file.filename}`
    });

    book.save()
    .then(() => { 
        console.log("Livre enregistré avec succès.");
        res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch(error => { 
        console.error("Erreur lors de l'enregistrement du livre:", error);
        res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                console.log("Non autorisé à modifier ce livre.");
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => {
                    console.log("Livre modifié avec succès.");
                    res.status(200).json({ message: 'Objet modifié!' });
                })
                .catch(error => {
                    console.error("Erreur lors de la modification du livre:", error);
                    res.status(401).json({ error });
                });
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la recherche du livre:", error);
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                console.log("Non autorisé à supprimer ce livre.");
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            console.log("Livre supprimé avec succès.");
                            res.status(200).json({ message: 'Objet supprimé !' });
                        })
                        .catch(error => {
                            console.error("Erreur lors de la suppression du livre:", error);
                            res.status(401).json({ error });
                        });
                });
            }
        })
        .catch(error => {
            console.error("Erreur lors de la recherche du livre à supprimer:", error);
            res.status(500).json({ error });
        });
};

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            console.log("Livre trouvé:", book);
            res.status(200).json(book);
        })
        .catch(error => {
            console.error("Erreur lors de la recherche du livre:", error);
            res.status(404).json({ error });
        });
};

exports.getAllBooks =  (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};



exports.giveRating = (req, res, next) => {
  const userId = req.body.userId;
  const grade = req.body.rating;
  
  if (grade < 0 || grade > 5) {
        console.log("Note invalide:", grade);
        return res.status(400).json({ error: "Note invalide." });
    }

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                console.log("Livre non trouvé.");
                return res.status(400).json({ error: "Livre non trouvé." });
            }
            if (book.userId === req.auth.userId) {
                console.log("L'utilisateur ne peut pas noter son propre livre.");
                return res.status(400).json({ error: "Vous ne pouvez pas noter votre propre livre." });
            }

            const alreadyGiveRating = book.ratings.some(
                (rating) => rating.userId.toString() === userId
            );
            if (alreadyGiveRating) {
                console.log("L'utilisateur a déjà noté ce livre.");
                return res.status(400).json({ error: "Vous avez déjà noté ce livre." });
            }

            book.ratings.push({ userId, grade });
            const totalRating = book.ratings.reduce((acc, currentValue) => acc + currentValue.grade, 0);
            const averageRating = totalRating / (book.ratings.length);
            book.averageRating = averageRating.toFixed(1);

            book.save()
                .then(() => {
                    console.log("Note ajoutée et moyenne mise à jour:", book);
                    res.status(200).json(book);
                })
                .catch((error) => {
                    console.error("Erreur lors de l'enregistrement de la note:", error);
                    res.status(400).json({ error });
                });
        })
        .catch((error) => {
            console.error("Erreur lors de la recherche du livre pour notation:", error);
            res.status(400).json({ error });
        });
};

exports.getBestRating = (res) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => {
            console.log("Livres avec les meilleures notes:", books);
            res.status(200).json(books);
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des livres avec les meilleures notes:", error);
            res.status(500).json({ error });
        });
};
