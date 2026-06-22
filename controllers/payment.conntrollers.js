

const { logData } = require("../../client/src/utils/console");
const paymentModel = require("../models/payment.model")

const addPayment = async (req,res) => {
    const addData = req.body.addData;
    const userId = req.params.id
    logData("addData",addData)
    logData("userId",userId)

    try {
            // Extraire les infos structurées du frontend
    const personalInfo = addData.personal_Info?.[0] || {};

    // Mapper PaymentType → enum Prisma
    const typeMap = {
      member: "COTISATION",
      other:  "COTISATION_TIERCE",
      guest:  "DON",
      carte:  "CARTE_MEMBRE",
    };

    const paymentPayload = {
      amount:      addData.totalPrice,
      phoneNumber: addData.numeroSend,
      name:        addData.nomclient || null,
      type:        typeMap[personalInfo.type] ?? "DON",
      description: personalInfo.article || null,
      status:      "PENDING",
      // Lier au user si connecté
      ...(userId && { userId: userId }),
    };
        const payment = await paymentModel.addPayment(paymentPayload)
        res.status(200).json({message:"Opération reussi avec succès!", payment})
    } catch (error) {
        res.status(500).json({message:"Erreur seuveur"})
    }
};
const getPayment = async (req,res) => {

    try {
        const payment = await paymentModel.getPayment()
        res.status(200).json({message:"Opération reussi avec succès!", payment})
    } catch (error) {
        res.status(500).json({message:"Erreur seuveur"})
    }
};
const getAllPayments= async (req,res) => {

    try {
        const payments = await paymentModel.getAllPayments()
        res.status(200).json({message:"Opération reussi avec succès!", payments})
    } catch (error) {
        res.status(500).json({message:"Erreur seuveur"})
    }
};

module.exports = {
    addPayment,
    getPayment,
    getAllPayments
}