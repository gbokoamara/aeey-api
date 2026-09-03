// const { logData } = require("../../client/src/utils/console");
const cardModel = require("../models/card.model");
const donationModel = require("../models/donation.model");
const eventModel = require("../models/event.model");
const paymentModel = require("../models/payment.model");


const webhook = async (req, res) => {
 try {
    const webhook = req.body;
   //  logData("webhook", webhook)
 } catch (error) {
    
 }
};

const checkPayment = async (req, res) => {
 try {
    const payment = req.body.payment;
    const Montant = payment?.Montant;
    const Method = payment?.moyen
    const personalInfo = payment?.personal_Info?.[0];
   //  logData("payment", payment);
   //  logData("personalInfo", personalInfo);

    const paymentId = personalInfo?.paymentId;
    let myPayment = {}

    //  verification de l'existance du paiement dans ma base
    if (paymentId) { myPayment = await paymentModel.getPayment(paymentId)}
   //  logData("myPayment", myPayment);
   //  retourner si le paiement  n'existe pas
    if (!myPayment) {
    return res.status(404).json({ status: false, message: "Paiement introuvable",});
   }

   let paymentData = {}
    if (payment?.statut === "paid") {
        // je prends 1% de chaque paiement
        const montantNet = Montant - (Montant * 0.01);

        const updatePayload = {status: "SUCCESS", amount: montantNet, method: Method}
        const updatePayment = await paymentModel.updatePayment(updatePayload, paymentId);
        paymentData = {...paymentData, updatePayload}
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
            const donUpdatePayload = {status: true, targetAmount: montantNet,}
            const donation = await donationModel.updateDonation( donUpdatePayload, myPayment.donationId);
            paymentData = { ...paymentData, donation };
            break;
         }
         case "event":
            // mise à jour de l'événement
            const event = await eventModel.getEvent(myPayment.eventId);

            const eventUpdatePayload = {
               collectedAmount: (event?.collectedAmount ?? 0) + montantNet,
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