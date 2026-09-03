
// const { Client, LocalAuth } = require("whatsapp-web.js");
// // const qrcode = require("qrcode-terminal");

// let ready = false;

// const client = new Client({
//     authStrategy: new LocalAuth({
//         clientId: "aeey"
//     }),

//     puppeteer: {
//         headless: true,
//         args: [
//             "--no-sandbox",
//             "--disable-setuid-sandbox"
//         ]
//     }
// });

// client.on("qr", (qr) => {
//     console.log("\nScanner ce QR Code avec WhatsApp\n");
//     qrcode.generate(qr, {
//         small: true
//     });
// });

// client.on("ready", () => {
//     ready = true;
//     console.log("✅ WhatsApp connecté");
// });

// client.on("authenticated", () => {
//     console.log("✅ Authentifié");
// });

// client.on("disconnected", (reason) => {
//     ready = false;
//     console.log("❌ Déconnecté :", reason);
// });

// client.initialize();

// const formatPhone = (phone) => {
//     phone = phone.replace(/\D/g, "");

//     return phone.endsWith("@c.us")
//         ? phone
//         : `${phone}@c.us`;
// };

// module.exports = {

//     sendNotifByWhatsapp: async ({ phone, message }) => {

//         if (!ready) {
//             throw new Error("WhatsApp n'est pas encore connecté.");
//         }

//         return await client.sendMessage(
//             formatPhone(phone),
//             message
//         );

//     }

// };


// // const axios = require("axios");

// // module.exports = {
// //     sendNotifByWhatsapp: async ({ phone, message }) => {
// //         try {
// //             const response = await axios.post(
// //                 `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
// //                 {
// //                     messaging_product: "whatsapp",
// //                     to: phone,
// //                     type: "text",
// //                     text: {
// //                         body: message
// //                     }
// //                 },
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
// //                         "Content-Type": "application/json"
// //                     }
// //                 }
// //             );

// //             return response.data;

// //         } catch (error) {
// //             console.error(
// //                 "Erreur envoi WhatsApp:",
// //                 error.response?.data || error.message
// //             );

// //             throw error;
// //         }
// //     }
// // };