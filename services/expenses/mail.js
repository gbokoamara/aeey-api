
const nodemailer = require("nodemailer");
const { BrevoClient } = require("@getbrevo/brevo");


const transporter = nodemailer.createTransport({
// service: "gmail",
// port: 465,
// secure: true,
host: "smtp.gmail.com",
port: 587,
secure: false,       // false pour le port 587
requireTLS: true, 
family: 4,
auth: {
user: process.env.MAIL_USER,
pass: process.env.MAIL_PASSWORD,
},
});

const sendNotifByNodemailer = async ({ email, subject, message }) => {
    if (!email) {
        throw new Error("Adresse email manquante");
    }

    const recipients = Array.isArray(email) ? email : [email];
    // console.log("📧 Envoi vers :", recipients);
    const result = await transporter.sendMail({
        from: `"AEEY" <${process.env.MAIL_USER}>`,
        to: recipients.join(","),
        subject,
        text: message,
    });

    // console.log("📨 Gmail result :", {
    //     messageId: result.messageId,
    //     accepted: result.accepted,
    //     rejected: result.rejected,
    //     response: result.response,
    // });

    return result;
};

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

const sendNotifByMail = async ({ email, subject, message }) => {
    if (!email) {
        throw new Error("Adresse email manquante");
    }

    const recipients = Array.isArray(email) ? email : [email];
    console.log("email", email)
    console.log("message", message)
    console.log("subject", subject)
    const result = await brevo.transactionalEmails.sendTransacEmail({
        subject,
        textContent: message,
        sender: {
            name: "AEEY",
            email: process.env.BREVO_SENDER_EMAIL, // votre email de compte Brevo au départ
        },
        to: recipients.map((e) => ({ email: e })),
    });
    console.log("📨 BREVO RESULT :", result);
    return result;
};


module.exports = {
sendNotifByNodemailer,
sendNotifByMail
};
