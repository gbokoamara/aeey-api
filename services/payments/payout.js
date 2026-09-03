const axios =  require("axios")
const payoutUrl = process.env.WITHDRAWAL_API_URL
const WITHDRAWAL_API_KEY = process.env.WITHDRAWAL_API_KEY;
const server_url = process.env.AEEY_API

const initPayout = async (data) => {
    const webhouk_url =  `${server_url}/webhook/payout` // "https://webhook.site/28a945c2-4c60-4aed-822a-5c8964ef99de"
    
    const payoutData = {
        ...data,
        webhouk_url,
    }
    try {
        // console.log("data", data)
        // console.log("payoutData", payoutData)
        // console.log("payoutUrl", payoutUrl)
        // console.log("WITHDRAWAL_API_KEY", WITHDRAWAL_API_KEY)

        const headers= {
            "moneyfusion-private-key": WITHDRAWAL_API_KEY,
            "Content-Type": "application/json"
        }
        const response = await axios.post(
            payoutUrl,
            payoutData,
            {headers}
        )
        // console.log("response", response?.data)
        return response.data;
    } catch (error) {
        console.error("Payout error: "  , error.message || error.response?.data);
        throw error;
    }
    
}

module.exports = { initPayout }