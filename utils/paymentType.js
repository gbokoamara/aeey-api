
const getPaymentType = (personalInfo) => {
    let paymentType;

    switch (personalInfo.type) {
    case "cautisation":
        paymentType =
        personalInfo.paymentFor === "other"
            ? "COTISATION_TIERCE"
            : "COTISATION";
        break;

    case "guest":
        paymentType = "DON";
        break;

    case "carte":
        paymentType = "CARTE";
        break;

    case "event":
        paymentType = "EVENT";
        break;

    default:
        paymentType = "DON";
    }
    return paymentType;
}

module.exports = getPaymentType