
const axios = require("axios");

module.exports = {
checkPaymentStatus : async (token) => {
    const checkUrl = process.env.FUSION_CHECK_URL
  try {
    const response = await axios.get(`${checkUrl}/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}
}

