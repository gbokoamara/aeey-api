const { uploadToCloudinary } = require("../utils/cloudinary");


const uploadImage  = async (req, res) => {
 try {
    // console.log('- Content-Type:', req.headers['content-type']);
    // console.log('- Fichier reçu:', req.file ? 'OUI' : 'NON');
    // console.log('- Nom du champ:', req.file?.fieldname);
    // console.log('- Nom du fichier:', req.file?.originalname);
    // console.log('- Taille:', req.file?.size, 'bytes'); // req.file.buffer
    // console.log('- buffer:', req.file.buffer,); // 

    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Aucun fichier reçu. Assurez-vous que le champ FormData s\'appelle "file"' 
      });
    }
    // Upload vers Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      'AEEY/users' // Dossier spécifique pour la galerie
    );
    // console.log("result.secure_url", result.secure_url)
    
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      message: 'Image uploadée avec succès sur Cloudinary'
    })
 } catch (error) {
    res.status(500).json({message:"Erreur seuveur", error: error.message})
 }
};

const uploadDocument = async (req, res) => {
 try {
  // console.log('📋 Infos requête:');
    // console.log('- Content-Type:', req.headers['content-type']);
    // console.log('- Fichier reçu:', req.file ? 'OUI' : 'NON');
    // console.log('- Nom du champ:', req.file?.fieldname);
    // console.log('- Nom du fichier:', req.file?.originalname);
    // console.log('- Taille:', req.file?.size, 'bytes');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Aucun fichier reçu. Assurez-vous que le champ FormData s\'appelle "file"' 
      });
    }
    // Upload vers Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      'AEEY/document' // Dossier spécifique pour la galerie
    );
    // console.log("result.secure_url", result.secure_url)
    
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      message: 'Document uploadée avec succès sur Cloudinary'
    })
 } catch (error) {
    res.status(500).json({message:"Erreur seuveur", error: error.message})

 }
}

module.exports = {uploadImage, uploadDocument}