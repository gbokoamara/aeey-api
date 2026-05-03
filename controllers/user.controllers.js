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

module.exports = { update, register };
