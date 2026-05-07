const { logData } = require("../../client/src/utils/console");
const eventModel = require("../models/event.model");

const addEvent = async (req, res) => {
  logData("event front client", req.body);
  const addData = req.body.addData;
  try {
    const addPayload = {
      title: addData.title,
      description: addData.description,
      location: addData.location,
      date: addData.date ? new Date(addData.date) : null,
      image: addData.image,
    };
    const event = await eventModel.addEvent(addPayload);
    res.status(200).json({ message: "Evenement ajouté avec succès !", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'evenement" });
  }
};

const updateEvent = async (req, res) => {
  logData("event front client", req.body);
  const updateData = req.body.updateData;
  const eventId = req.params.id;
  logData("eventId front client", eventId);

  try {
    const updatePayload = {
      title: updateData.title,
      description: updateData.description,
      location: updateData.location,
      date: updateData.date ? new Date(updateData.date) : null,
      image: updateData.image,
    };
    const event = await eventModel.updateEvent(eventId, updatePayload);
    res.status(200).json({ message: "Evenement modifié avec succès !", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de l'evenement" });
  }
};

const publishEvent = async (req, res) => {
  logData("event front client", req.body);
  const {isPublished} = req.body
  const eventId = req.params.id;
  logData("eventId front client", eventId);

  // Sécurité : vérifier si l'ID est présent
  if (!eventId) {
    return res.status(400).json({ message: "ID de l'événement manquant" });
  }


  try {
    const updatePayload = {
      isPublished: isPublished,
    };
    const event = await eventModel.updateEvent(eventId, updatePayload);
    res.status(200).json({ message: "Evenement modifié avec succès !", event });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de l'evenement" });
  }
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  logData("eventId front client", eventId);

  try {
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
    const events = await eventModel.getAllActiveEvents();
    res.status(200).json({ message: "Evenements reçus avec succès !", events });
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
      .json({ message: "Erreur lors de recuperation des evenements" });
  }
};

const getEvent = async (req, res) => {
  const eventId = req.params.id;
  logData("eventId", eventId);
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
