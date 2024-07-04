const multer = require('multer');
const sharp = require('sharp');
const path = require ('path')
const fs = require ('fs')



const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  
  filename: (req, file, callback) => {
    const name = file.originalname.slice(0, 3);
    callback(null, name + Date.now() + ".webp");
  },

   // Vérification du type MIME du fichier
   fileFilter: (req, file, callback) => {
    !file.originalname.match(/\.(jpg|jpeg|png|webp)$/)
      ? callback(
          new Error("Seuls les fichiers JPG, JPEG et PNG sont autorisés !"),
          false
        )
      : callback(null, true);
  },
});




module.exports = multer({storage: storage}).single('image');

module.exports.optimizeImage = (req, res, next ) => {
    if(!req.file) {
        return next();
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const outputFilePath = path.join("images", `optimized_${fileName}`);

    // Modification des fichiers pour l'ajout du livre
    sharp(filePath)
        .resize({ height: 600 })
        .toFile(outputFilePath)
        .then(() => {
        console.log(`Image ${fileName} optimisée avec succès !`);
        // Supprime le fichier original et remplace par le nouveau dans le dossier images
        fs.unlink(filePath, () => {
            req.file.path = outputFilePath;
            console.log(`Image ${fileName} supprimée avec succès !`);
            next();
        });
    })
        .catch((err) => {
            console.log(err);
            return next();
    });
};
