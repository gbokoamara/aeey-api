const cotisationModel = require("../models/cotisation.model");

// create update getcotisationIdById getCotisations

const addCotisation = async (req, res) => {
  // console.log("id", req.params.id);
  const id = req.params.id;
  const addData = req.body.addData;
  // console.log("req.body", addData);
  try {

    const addPayload = {
      title: addData.title,
      amount: parseInt(addData.amount),
      description: addData.description,
      period: addData.period,
    }
    // console.log("addPayload", addPayload);
    const cotisation = await cotisationModel.create(addPayload);
    // console.log("cotisation créée", cotisation);

    return res.status(201).json({ message: "Ajout de cotisation", cotisation });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const updateCotisation = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body.updateData;
  try {
    // console.log("id", id);
    // console.log("updateData reçu", updateData);
    const updatePayload = {
      title: updateData.title,
      amount: parseInt(updateData.amount),
      description: updateData.description,
      period: updateData.period,
    }
    const updateCotisation = await cotisationModel.update(updatePayload, id);
    // console.log("updateCotisation créée", updateData);

    return res.status(201).json({ message: "Demande de carte envoyée", updateCotisation });

  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const getCotisation = async (req, res) => {
  const userId = req.params.id
  try {
    console.log("userId", userId)
    const cotisation = await cotisationModel.getcotisationIdById(cotisationId)
    res.status(200).json({message:"recupération avec succès!", cotisation})
  } catch (error) {
    console.error(error)
    res.status(500).json({message:"erreur de recupération de la carte"})
  }
}

const getCotisations = async (req, res) => {
  try {
    const cautisations = await cotisationModel.getCotisations()
    res.status(200).json({message:"succès de recupération des cautisations", cautisations})
  } catch (error) {
    console.error(error)
    res.status(500).json({message:"erreur de recupération des cautisations"})
  }
}

const deleteCotisation = async (req, res) => {
  const cotisationId = req.params.id
  try {
    // console.log("cotisationId", cotisationId)
    const cotisations = await cotisationModel.deleteCotisation(cotisationId)
    res.status(200).json({message:"succès de suppression de la  cautisation", cotisations})
  } catch (error) {
    console.error(error)
    res.status(500).json({message:"erreur de recupération des cautisations"})
  }
}

module.exports = {
  addCotisation,
  updateCotisation,
  getCotisation,
  getCotisations,
  deleteCotisation
}