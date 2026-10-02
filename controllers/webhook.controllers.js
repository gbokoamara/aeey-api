// const { logData } = require("../../client/src/utils/console");
const adminModel = require("../models/admin.model");
const cardModel = require("../models/card.model");
const donationModel = require("../models/donation.model");
const eventModel = require("../models/event.model");
const paymentModel = require("../models/payment.model");


const checkPayment = async (req, res) => {
   const payment = req.body;
  try {
    const result = await paymentModel.processPaymentResult(payment);

    return res.status(200).json({
      message: result.paid
        ? "Paiement traité avec succès"
        : "Paiement non encore confirmé",
      status: result.success,
      ...result,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

const webhook = async (req, res) => {
 try {
    const stats = await paymentModel.getPaymentStat();
    const amount = stats.totalAmount;
    const treasury = await adminModel.updateTreasury(amount)
    
    return res.status(200).json({message:'Données retournées avec succès', data: {stats, amount, treasury}})
 } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message || "Erreur serveur"})
 }
};

const checkPaymentOld = async (req, res) => {
 try {
    let payment = req.body.payment;
    let Montant = {};
    const Method = payment?.moyen
    const personalInfo = payment?.personal_Info?.[0];
   //  logData("payment", payment);

    let paymentId = personalInfo?.paymentId;
    let myPayment = {}

    //  verification de l'existance du paiement dans ma base
    if (paymentId) { myPayment = await paymentModel.getPayment(paymentId)}

   //  retourner si le paiement  n'existe pas
    if (!myPayment) {
    return res.status(403).json({ status: false, message: "Paiement introuvable",});
   }

   if (myPayment.status === "SUCCESS") {
    return res.status(403).json({ status: false, message: "Paiement déjà succèss !",});
   }

   Montant = myPayment.amount;
   paymentId = myPayment.id;
   
   let paymentData = {}
    if (payment?.statut === "paid") {
        const updatePayload = {status: "SUCCESS", amount: Montant, method: Method}
        const updatePayment = await paymentModel.updatePayment(updatePayload, paymentId);
        paymentData = {...paymentData, updatePayment}
      //   logData("updatePayment", updatePayment)

        switch (personalInfo.type) {
         case "carte": {
            // mise à jour du don
            const cardUpdatePayload = {status: "VALIDEE" }
            const card = await cardModel.update( cardUpdatePayload, personalInfo.cardId );
            paymentData = { ...paymentData, card };
            break;
         }
         case "guest": {
            // mise à jour du don
            const donUpdatePayload = {status: true, targetAmount: Montant,}
            const donation = await donationModel.updateDonation( donUpdatePayload, myPayment.donationId);
            paymentData = { ...paymentData, donation };
            break;
         }
         case "event":
            // mise à jour de l'événement
            const event = await eventModel.getEvent(myPayment.eventId);

            const eventUpdatePayload = {
               collectedAmount: (event?.collectedAmount ?? 0) + Montant,
               participantCount: (event?.participantCount ?? 0)+ 1,
            };
            const eventUpdated = await eventModel.updateEvent(myPayment.eventId, eventUpdatePayload);
            paymentData = { ...paymentData, eventUpdated };
            break;

         case "member":
            // mise à jour de la cotisation
            break;
         }
    };

    res.status(200).json({message:"Opération reussi avec succès!", status: true, paymentData})
 } catch (error) {
   res.status(500).json({message:"Erreur seuveur", error: error.message})

 }
}

const checkPayout = async (req, res) => {
   console.log("req", req)
   // const { event, tokenPay, montant, numeroRetrait, moyen, createdAt } = req?.body;
 try {
   //  console.log("event", event)
   //   console.log("tokenPay", tokenPay)
   //    console.log("montant", montant)
   //     console.log("numeroRetrait", numeroRetrait)
   //      console.log("moyen", moyen)
   //       console.log("createdAt", createdAt)
 } catch (error) {
   console.error(error);
    res.status(500).json({message:"Erreur seuveur", error: error.message})
 }
};

module.exports = {webhook, checkPayment, checkPayout}