// const { logData } = require("../../client/src/utils/console");
const userModel = require("../models/user.model");

const profil = async(req, res) => {
  const userId = req.params.id
  try {
    const user = await userModel.getProfil(userId);
  res.status(200).json({message:"Utilisateur recuperé avec succès!", user}) 
  } catch (error) {
    res.status(500).json({message: "Erreur de recuperation server", error:error.message})
  }
}
const update = async (req, res) => {
  // logData("update profil :=>", req.body)
  // logData("updateDate de req.body.updateDate", req.body.updateDate)

  const updateDate = req.body.updateDate;
  const { id } = req.params;
    // logData("id", req.params)

  try {
    const updatedUser = await userModel.update(id, {
      firstName: updateDate.firstName,
      lastName: updateDate.lastName,
      number: updateDate.number,
      email: updateDate.email,
      photo: updateDate.photo,
      city: updateDate.city,
      address: updateDate.address,
      sex: updateDate.sex,
      role: updateDate.role,
      occupation: updateDate.occupation,
      entreprise: updateDate.entreprise,
      etablissement: updateDate.etablissement,
      niveau: updateDate.niveau,
      filiere: updateDate.filiere,
      matricule: updateDate.matricule,
      document: updateDate.document,
      section: updateDate.section,
      poste: updateDate.poste,
      memberType: updateDate. memberType,
      profession: updateDate.profession,
    });

    // console.log("updatedUser", updatedUser)

    res.status(200).json({message:"Profil modifié avec succèss !", user: updatedUser})
  } catch (error) {
    res.status(500).json({message:"Erreur de modification  de profil!", error: error.message})
  }
};

const register = (req, res) => {
  res.send("enregistrement en cours ...");
};

const memberRequest = async (req, res) => {
  // logData("req.body.cardData", req.body.cardData)
  let cardData = req.body.cardData
  // logData("cardData", cardData)

  const {id} = req.params
  try {
    const updatePayload = {
            firstName: cardData.firstName,
            lastName: cardData.lastName,
            number: cardData.telephone, // Mapping: telephone -> number
            email: cardData.email,
            city: cardData.city,
            address: cardData.address,
            sex: cardData.sex,
            occupation: cardData.occupation,
            entreprise: cardData.entreprise,
            etablissement: cardData.etablissement,
            niveau: cardData.niveau,
            filiere: cardData.filiere,
            matricule: cardData.matricule,
            section: cardData.section,
            birthDate: cardData.dateNaissance ? new Date(cardData.dateNaissance) : null,
            memberStatus: "PENDING",
            isMember: true,
            certifie: cardData.certifie,
            poste: cardData.poste,
            memberType: cardData.memberType,
            profession: cardData.profession,
            // document: cardData.document, // Attention: Prisma attend un String pour document, vérifie le format
        };
    const member = await userModel.update(id, updatePayload)
    res.status(200).json({message:"demande effectuée avec succès !", status : true, member})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la demande d'adhésion" });
  }
};

module.exports = { profil,update, register, memberRequest };
