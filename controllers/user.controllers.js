const { logData } = require("../../client/src/utils/console");
const userModel = require("../models/user.model");

const update = async (req, res) => {
  // logData("update profil :=>", req.body)
  logData("updateDate de req.body.updateDate", req.body.updateDate)
  const {
    firstName,
    lastName,
    number,
    email,
    photo,
    city,
    address,
    sex,
    role,
    occupation,
    entreprise,
    etablissement,
    niveau,
    filiere,
    matricule,
    document,
    section,
    poste,
    memberType, 
    profession,
  } = req.body.updateDate;

  const { id } = req.params;
    logData("id", req.params)

  try {
    const updatedUser = await userModel.update(id, {
      firstName: firstName,
      lastName: lastName,
      number: number,
      email: email,
      photo: photo,
      city: city,
      address: address,
      sex: sex,
      role: role,
      occupation: occupation,
      entreprise: entreprise,
      etablissement: etablissement,
      niveau: niveau,
      filiere: filiere,
      matricule: matricule,
      document: JSON.stringify(document),
      section: section,
      poste: poste,
      memberType:  memberType,
      profession: profession,
    });
    logData("updatedUser", updatedUser)

    res.status(200).json({message:"Profil modifié avec succèss !", user: updatedUser})
  } catch (error) {
    res.status(500).json({message:"Erreur de modification  de profil!", error: error.message})
  }
};

const register = (req, res) => {
  res.send("enregistrement en cours ...");
};

const memberRequest = async (req, res) => {
  logData("req.body.cardData", req.body.cardData)
  let cardData = req.body.cardData
  logData("cardData", cardData)

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
    res.status(200).json({message:"demande effectuée avec succès !", member})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la demande d'adhésion" });
  }
};

module.exports = { update, register, memberRequest };
