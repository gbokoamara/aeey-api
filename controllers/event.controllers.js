// const { logData } = require("../../client/src/utils/console");
const eventModel = require("../models/event.model");
const userModel = require("../models/user.model");

const addEvent = async (req, res) => {
  const addData = req.body.addData;
  
  const user = req.user;
  const userId = user?.id

  try {
    // verification user
    const existingUser = userModel.getProfil(userId) ;
    if (!existingUser) {
      return res.status(404).json({message: "Aucun utilisateur trouvé, veuillez vous connecter !"})
    } ;

    const addPayload = {
      title: addData.title,
      description: addData.description,
      location: addData.location,
      date: addData.date ? new Date(addData.date) : null,
      image: addData.image,
      amount: parseInt(addData.amount),
    };
    const event = await eventModel.addEvent(addPayload);
    res.status(200).json({ message: "Evenement ajouté avec succès !", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'evenement", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  
  const updateData = req.body.updateData;
  const eventId = req.params.id;
  const user = req.user;
  const userId = user?.id;

  try {
    // verification user
    const existingUser = userModel.getProfil(userId) ;
    if (!existingUser) {
      return res.status(404).json({message: "Aucun utilisateur trouvé, veuillez vous connecter !"})
    } ;

    const updatePayload = {
      title: updateData.title,
      description: updateData.description,
      location: updateData.location,
      date: updateData.date ? new Date(updateData.date) : null,
      image: updateData.image,
      amount: parseInt(updateData.amount),
    };
    const event = await eventModel.updateEvent(eventId, updatePayload);
    res.status(200).json({ message: "Evenement modifié avec succès !", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de l'evenement", error: error.message });
  }
};

const publishEvent = async (req, res) => {
  const {isPublished} = req.body
  const eventId = req.params.id;
  const user = req.user;
  const userId = user?.id;

  // Sécurité : vérifier si l'ID est présent
  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement manquant" });
  }

  try {
    // verification user
    const existingUser = userModel.getProfil(userId) ;
    if (!existingUser) {
      return res.status(404).json({message: "Aucun utilisateur trouvé, veuillez vous connecter !"})
    } ;

    const updatePayload = {
      isPublished: isPublished,
    };

    const event = await eventModel.updateEvent(eventId, updatePayload);
    return res.status(200).json({ message: "Evenement modifié avec succès !", event });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Erreur lors de la modification de l'evenement" });
  }
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;
  const userId = user?.id;

  try {
    // verification user
    const existingUser = userModel.getProfil(userId) ;
    if (!existingUser) {
      return res.status(404).json({message: "Aucun utilisateur trouvé, veuillez vous connecter !"})
    } ;

    await eventModel.deleteEvent(eventId);
    res.status(200).json({ message: "Evenement supprimé avec succès !" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppresion de l'evenement" });
  }
};

const getAllActiveEvents = async (req, res) => {
  try {
    const {events, eventStats} = await eventModel.getAllActiveEvents();
    res.status(200).json({ message: "Evenements reçus avec succès !", events, eventStats });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de recuperation des evenements" });
  }
};

// getAllEvents
const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.getAllEvents();
    res.status(200).json({ message: "Evenements reçus avec succès !", events });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de recuperation des evenements", error: error.message });
  }
};

const getEvent = async (req, res) => {
  const eventId = req.params.id;
  // logData("eventId", eventId);
  try {
    const event = await eventModel.getEvent(eventId);
    res.status(200).json({ message: "Evenement reçus avec succès !", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de recuperation de l'evenement" });
  }
};

module.exports = {
  addEvent,
  getAllActiveEvents,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
};
