

// const { logData } = require("../../client/src/utils/console");
const cardModel = require("../models/card.model");
const donationModel = require("../models/donation.model");
const paymentModel = require("../models/payment.model");
const userModel = require("../models/user.model");
const cotisationRecordModel = require("../models/paymentRecord.model")
const getPaymentType = require("../utils/paymentType");
const { payment } = require("../utils/prisma");

const addPayment = async (req,res) => {
    const addData = req.body.addData;
    const userId = req.params.id
    // logData("addData",addData)
    // logData("userId",userId)

    try {
        // Extraire les infos structurées du frontend
        const personalInfo = addData.personal_Info?.[0] || {};
        const cardId = personalInfo.cardId;
        const paymentFor = personalInfo?.paymentFor ;
        let donPayload = {};
        let donation = {};
        let record = {};

        let card = null;
        if (cardId) {card = await cardModel.getCardByCardId(cardId);}

        let memberId = userId;
        if (paymentFor === "other") {
            // const number = parseInt(personalInfo?.otherNumber)
            const number = personalInfo?.otherNumber
            // logData("number",number)
            const member = await userModel.getUserByNumber(number);
            // logData("member",member)
            if (!member) { return res.status(404).json({ message: "Le membre bénéficiaire est introuvable." }); };
            memberId = member.id
        }
        // logData("memberId",memberId)

        // Mapper PaymentType → enum Prisma
        const paymentType = getPaymentType(personalInfo);
        // logData("paymentType", paymentType)

        
        if (personalInfo?.type === 'guest') {
           donPayload = {
            title:  addData?.nomclient,
            description:  Object.keys(addData.article[0])[0],
            targetAmount: addData?.totalPrice,
           } 
           donation = await donationModel.addDonation(donPayload);
        }
        // logData("donation", donation);
        const paymentPayload = {
        amount:      addData.totalPrice,
        phoneNumber: addData.numeroSend,
        name:        addData.nomclient || null,
        type:        paymentType,
        description: personalInfo.article || null,
        status:      "PENDING",
        // Lier au user si connecté
        ...(userId && { userId: userId }),
        // lier la carte s'il y a un cardId
        ...(cardId && {memberCardId: cardId,}),
            // lier la cautisation s'il y a un cotisationId
        ...(personalInfo.cotisationId && {cotisationId: personalInfo.cotisationId}),
            // lier le don s'il y a un donationId
        ...(personalInfo.donationId && { donationId: personalInfo.donationId}),
            // lier l'evenement s'il y a un eventId
        ...(personalInfo.eventId && {eventId: personalInfo.eventId}),
        // lier le don s'il y a un donId
        ...(donation.id && {donationId: donation.id})
        };
        // logData("paymentPayload",paymentPayload);
        // logData("donPayload",donPayload);

        const payment = await paymentModel.addPayment(paymentPayload);

        if ( payment.type === "COTISATION" || payment.type === "COTISATION_TIERCE") {
        const recordPayload = {
        paymentId: payment.id,
        cotisationId: payment.cotisationId,
        memberId,
        payerId: userId,
        };
        // logData("recordPayload", recordPayload);
        record = await cotisationRecordModel.addRecord(recordPayload);
        // logData("record", record);
        }

        res.status(200).json({message:"Opération reussi avec succès!", payment, record})
    } catch (error) {
        res.status(500).json({message:"Erreur seuveur", error: error.message})
    }
};
const getPayment = async (req,res) => {
    const PaymentId = req.params.id;
    // console.log("PaymentId", PaymentId)
    try {
        const payment = await paymentModel.getPayment(PaymentId)
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

const getUserPayments= async (req,res) => {
    const userId = req.params.id;
    // logData("userId", userId)
    try {
        const payments = await paymentModel.getUserPayments(userId)
        res.status(200).json({message:"Opération reussi avec succès!", payments})
    } catch (error) {
        res.status(500).json({message:"Erreur seuveur", error: error.message})
    }
};

const getPaymentStat= async (req,res) => {

    try {
        const stats = await paymentModel.getPaymentStat()
        res.status(200).json({message:"Opération reussi avec succès!", stats})
    } catch (error) {
        res.status(500).json({message:"Erreur seuveur"})
    }
};

module.exports = {
    addPayment,
    getPayment,
    getAllPayments,
    getPaymentStat,
    getUserPayments
}