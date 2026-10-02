

const schedule = require("node-schedule");
const {checkPaymentStatus} = require("./checkPaymentStatus");
const { processPaymentResult } = require("../../models/payment.model");

// Stockage des jobs actifs
const paymentJobs = new Map();


// ======================================================
// ARRÊTER LE CHECKER
// ======================================================

const stopPaymentChecker = (paymentId) => {
  const job = paymentJobs.get(paymentId);

  if (job) {
    job.cancel();
    paymentJobs.delete(paymentId);

    console.log(`🛑 Checker arrêté : ${paymentId}`);
  }
};


// ======================================================
// DÉMARRER LE CHECKER
// ======================================================

const startPaymentChecker = async (token, paymentId) => {

  if (!token || !paymentId) {
    console.log("❌ Token ou paymentId manquant");

    return;
  }

  // Éviter deux schedulers pour le même paiement
  if (paymentJobs.has(paymentId)) {
    console.log(
      `⚠️ Checker déjà actif pour le paiement ${paymentId}`
    );

    return;
  }

  console.log(
    `🚀 Démarrage checker paiement : ${paymentId}`
  );


  // ======================================================
  // DURÉE MAXIMALE : 48 HEURES
  // ======================================================

  const startTime = Date.now();

  const MAX_DURATION =
    48 * 60 * 60 * 1000;


  // ======================================================
  // FONCTION QUI FAIT LE CHECK
  // ======================================================

  const check = async () => {

    try {

      // -----------------------------------------------
      // Vérifier si les 48h sont dépassées
      // -----------------------------------------------

      if (
        Date.now() - startTime >= MAX_DURATION
      ) {

        console.log(
          `⏰ 48h dépassées pour ${paymentId}`
        );

        stopPaymentChecker(paymentId);

        return;
      }


      // -----------------------------------------------
      // Vérification FusionPay
      // -----------------------------------------------

      console.log(`🔎 Vérification FusionPay : ${paymentId}`);

      const fusionPayment = await checkPaymentStatus(token);

      console.log("📥 Réponse FusionPay :",fusionPayment);

      // -----------------------------------------------
      // Traitement du résultat
      // -----------------------------------------------
      const result = await processPaymentResult( fusionPayment?.data || fusionPayment );

      // -----------------------------------------------
      // PAIEMENT RÉUSSI
      // -----------------------------------------------

      if ( result?.paid === true || result?.alreadyProcessed === true) {
        console.log(`✅ Paiement confirmé : ${paymentId}`);
        stopPaymentChecker(paymentId);
        return;
      }

      console.log(`⏳ Paiement toujours en attente : ${paymentId}`);

    } catch (error) {

      console.error(
        `❌ Erreur check paiement ${paymentId}:`,
        error.message
      );

      // IMPORTANT :
      // On ne stoppe pas le scheduler.
      // Il réessaiera au prochain passage.
    }
  };


  // ======================================================
  // CRÉER LE SCHEDULER
  // ======================================================

  const job = schedule.scheduleJob(
    `*/1 * * * *`,
    check
  );

  // Enregistrer le job
  paymentJobs.set(paymentId, job);


  // ======================================================
  // PREMIER CHECK IMMÉDIAT
  // ======================================================

  await check();
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  startPaymentChecker,
  stopPaymentChecker,
};