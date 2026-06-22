// const { logData } = require("../../client/src/utils/console")
const userModel = require("../models/user.model");
const cardModel = require("../models/card.model");
const { buildCardData } = require("../utils/buildCardData");



const requestCard = async (req, res) => {
  // logData("id", req.params.id);
  const id = req.params.id;
  try {
    const user = await userModel.getUser(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    // logData("user", user);

    // if (user.memberStatus === "PENDING")
    //   return res.status(403).json({ message: "Membre non approuvé" });

    const existingCard = await cardModel.getCardByUserId(id);
    if (existingCard) return res.status(409).json({ message: "Carte déjà existante" });

    const createPayload = buildCardData(user);
    // logData("createPayload", createPayload);

    const card = await cardModel.create(createPayload);
    // logData("card créée", card);

    return res.status(201).json({ message: "Demande de carte envoyée", card });

  } catch (error) {
    // logData("erreur requestCard", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getCard = async (req, res) => {
  const userId = req.params.id
  try {
    // logData("userId", userId)
    const card = await cardModel.getCardByUserId(userId)
    res.status(200).json({message:"recupération avec succès!", card})
  } catch (error) {
    console.error(error)
    res.status(500).json({message:"erreur de recupération de la carte"})
  }
}


module.exports = {
  requestCard,
  getCard
}