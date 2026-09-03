const { generateOTP } = require("../../utils/otp");
const { sendNotifByMail } = require("./mail");
const { sendNotifByWhatsapp } = require("./whatsapp");

module.exports = {
  paymentSuccess: async (member) => {
    return await sendNotifByMail({
      email: member.email,
      message: `
        Bonjour ${member.name},
        Votre paiement a été validé avec succès.
        Merci pour votre confiance envers AEEY.
        `,
    });
  },

  cardValidated: async (member) => {
    return await sendNotifByMail({
      email: member.email,
      message: `
        Bonjour ${member.name},
        Votre carte membre AEEY est maintenant disponible.
        Code: ${member.card.code}
        `,
    });
  },

  sendOtp: async (number) => {
    const code = generateOTP();
    await sendNotifByMail({
      email: number,
      message: `
            Votre code de vérification AEEY est :

            ${code}

            Ce code expire dans 10 minutes.
            `,
    });
    return code;
  },

  // withdrawApproveNotif: async (moderators, initiator, url) => {
  //   const emails = moderators.map(moderator => moderator.email);
  //   return await sendNotifByMail({
  //     email: emails,
  //     subject: "AEEY - Demande de retrait à approuver",
  //     message: `
  //       Bonjour ${moderator.name},
  //       ${initiator.name} a initié une demande de retrait.
  //       Merci de vous connecter à votre espace AEEY afin de l'approuver.
  //       ${url}`,
  //   });
  // },

  withdrawApproveNotif: async (moderators, initiator, url) => {
    const notifications = moderators.map((moderator) => {
      return sendNotifByMail({
        email: moderator.email,
        subject: "AEEY - Demande de retrait à approuver",
        message: `
        Bonjour ${moderator.firstName},

        ${initiator.firstName} a initié une demande de retrait.

        Merci de vous connecter à votre espace AEEY afin de l'approuver.

        ${url}

        Cordialement,
        L'équipe AEEY
         `.trim(),
      });
    });

    return await Promise.all(notifications);
  },
  withdrawSuccess: async (moderator, initiator) => {
    return await sendNotifByMail({
      email: moderator.email,
      message: `
        Bonjour ${moderator.name},
        Le retrait initié par ${initiator.name} a été validé avec succès.
        Merci.
        `,
    });
  },
};
