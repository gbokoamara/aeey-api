// const { logData } = require("../../client/src/utils/console")
const userModel = require("../models/user.model");
const cardModel = require("../models/card.model");
const { buildCardData } = require("../utils/buildCardData");



const requestCard = async (req, res) => {
  const user = req.user;
  const userId = user?.id
  const id = req.params.id;
  try {
    const user = await userModel.getUser(userId);
    if (!user) {return res.status(404).json({ message: "Utilisateur introuvable" });}


    if (user.isVerify === false){
       return res.status(400).json({ message: "Membre non approuvé" });
    }

    const existingCard = await cardModel.getCardByUserId(user.id);
    if (existingCard) {
      return res.status(400).json({ message: "Carte déjà existante" });
    }

    const createPayload = buildCardData(user);

    const card = await cardModel.create(createPayload);

    return res.status(201).json({ message: "Demande de carte envoyée", card });

  } catch (error) {
    return res.status(500).json({ message: error.message || "Erreur serveur" });
  }
};

const getCard = async (req, res) => {
  const userId = req.params.id
  try {
    const card = await cardModel.getCardByUserId(userId)
    res.status(200).json({message:"recupération avec succès!", card})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message || "Erreur serveur" }); 
  }
}

const getrequestedCards = async (req, res) => {
  try {
    const cards = await cardModel.getRequestedCars()
    res.status(200).json({message:"succès de recupération des cartes en attente de validation", cards})
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message || "Erreur serveur" }); 
  }
}

module.exports = {
  requestCard,
  getCard,
  getrequestedCards,
}