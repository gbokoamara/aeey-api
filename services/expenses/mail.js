
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
// service: "gmail",
host: "smtp.gmail.com",
port: 465,
secure: true,
family: 4,
auth: {
user: process.env.MAIL_USER,
pass: process.env.MAIL_PASSWORD,
},
});

const sendNotifByMail = async ({ email, subject, message }) => {
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

module.exports = {
sendNotifByMail,
};
