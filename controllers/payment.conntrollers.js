

const cardModel = require("../models/card.model");
const donationModel = require("../models/donation.model");
const paymentModel = require("../models/payment.model");
const userModel = require("../models/user.model");
const cotisationRecordModel = require("../models/paymentRecord.model")
const getPaymentType = require("../utils/paymentType");
const { makePayment } = require("../services/payments/makePayment");
const {addFeePercent} = require("../utils/addFeePercent");
const adminModel = require("../models/admin.model");
const {checkPaymentStatus} = require("../services/payments/checkPaymentStatus");
const { startPaymentChecker } = require("../services/payments/checkWithShedule");

const addPayment = async (req,res) => {
    const addData = req.body.addData;
    const userId = req.params.id
    console.log("addData",addData)
    console.log("userId",userId)
    // return ; 
 
try {
  const personalInfo = addData.personal_Info?.[0] || {};

  const cardId = personalInfo.cardId;
  const paymentFor = personalInfo.paymentFor;

  let donation = {};
  let record = {};
  let card = {} ;
  let fusionPayUrl = {}
  let newAmount = addData.amount;


  // ==========================================
  // CARTE
  // ==========================================

  if (cardId) {
    card = await cardModel.getCardByCardId(cardId);
  }

  // ==========================================
  // BÉNÉFICIAIRE
  // ==========================================

  let member = await userModel.getUser(userId);

  if (!member) {
    return res.status(404).json({
      message: "Le membre connecté est introuvable.",
    });
  }

  if (paymentFor === "other") {
    const beneficiaryNumber = personalInfo.otherNumber?.trim();

    if (!beneficiaryNumber) {
      return res.status(400).json({
        message: "Le numéro du membre bénéficiaire est requis.",
      });
    }

    member = await userModel.getUserByNumber(beneficiaryNumber);

    if (!member) {
      return res.status(403).json({
        message: "Le membre bénéficiaire est introuvable.",
      });
    }
  }

  const memberId = member.id;

  // ==========================================
  // TYPE DE PAIEMENT
  // ==========================================

  const paymentType = getPaymentType(personalInfo);

  // ==========================================
  // DON
  // ==========================================

  if (personalInfo?.type === "guest") {
    const donPayload = {
      title: addData?.nomclient,
      description: Object.keys(addData.article[0])[0],
      targetAmount: addData?.totalPrice,
    };

    donation = await donationModel.addDonation(donPayload);
  }

  // ==========================================
  // PAYLOAD POUR L'ENREGISTREMENT AEEY
  // ==========================================

  const paymentPayload = {
    amount: addData.totalPrice,
    // Bénéficiaire
    phoneNumber: member.number,
    name: `${member.firstName || ""} ${member.lastName || ""}`.trim(),
    type: paymentType,
    description: personalInfo.article || null,
    status: "PENDING",
    // Payeur connecté
    ...(userId && {
      userId,
    }),

    ...(cardId && {
      memberCardId: cardId,
    }),

    ...(personalInfo.cotisationId && {
      cotisationId: personalInfo.cotisationId,
    }),

    ...(personalInfo.donationId && {
      donationId: personalInfo.donationId,
    }),

    ...(personalInfo.eventId && {
      eventId: personalInfo.eventId,
    }),

    ...(donation?.id && {
      donationId: donation.id,
    }),
  };

  // ==========================================
  // 1. ENREGISTREMENT DANS AEEY
  // ==========================================

  const payment = await paymentModel.addPayment(paymentPayload);

  if (!payment) {
    return res.status(500).json({
      message: "Impossible d'enregistrer le paiement.",
    });
  }


// console.log("type fee", typeof payInFee);
  const { payInFee } = await adminModel.getFee()
   console.log("fee", payInFee)
  if (payInFee) {
   newAmount =  addFeePercent(addData.totalPrice, payInFee);
  }
  console.log("newAmount", newAmount)
  // ==========================================
  // 2. PAYLOAD POUR FUSIONPAY
  // ==========================================

  // On part du payload ORIGINAL reçu du frontend
  const fusionPayPayload = {
  ...addData,
  totalPrice:  Math.ceil(newAmount),
  // totalPrice: newAmount,
  personal_Info: [
    {
      ...addData.personal_Info?.[0],
      paymentId: payment.id,
    },
  ],
};

  console.log("fusionPayPayload :", fusionPayPayload);

  // ==========================================
  // 3. ENVOI À FUSIONPAY
  // ==========================================

  const {statut, token, url, message} = await makePayment(fusionPayPayload);
  // On part du payload ORIGINAL reçu du frontend
  
  if (statut === true) {
    fusionPayUrl = url
    const updatePayload = {tokenPay: token,};
      await paymentModel.updatePayment(updatePayload, payment.id)
    }

  // ==========================================
  // DÉMARRER LE CHECK AUTOMATIQUE
  // ==========================================
  if (token) {
    await startPaymentChecker(
      token,
      payment.id
    );

  }

  // ==========================================
  // 4. ENREGISTREMENT DE LA COTISATION
  // ==========================================

  if (
    payment.type === "COTISATION" ||
    payment.type === "COTISATION_TIERCE"
  ) { 
    const recordPayload = {
      paymentId: payment.id,
      cotisationId: payment.cotisationId,
      // Bénéficiaire
      memberId: member.id,
      // Payeur
      payerId: userId,
    };

    record = await cotisationRecordModel.addRecord(recordPayload);
  }

  // ==========================================
  // RÉPONSE
  // ==========================================

  return res.status(200).json({
    message: "Opération réussie avec succès !",
    payment,
    record,
    fusionPay: {
      token,
      statut,
      message,
      fusionPayUrl,
    },
  });

}  catch (error) {
    return res.status(500).json({ message: error.message || "Erreur seuveur"})
}};

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
        const {payments, paymentStats} = await paymentModel.getAllPayments()
        res.status(200).json({message:"Opération reussi avec succès!", payments, paymentStats})
    } catch (error) {
        res.status(500).json({message:"Erreur seuveur"})
    }
};

const getUserPayments= async (req,res) => {
    const userId = req.params.id;
    // console.log("userId", userId)
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