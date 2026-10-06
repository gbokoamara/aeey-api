

const rateLimit = require("express-rate-limit");

const rateLimitHelper = ({
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 10,
    message = "Trop de tentatives. Veuillez réessayer plus tard."
} = {}) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,

        message: {
            message
        }
    });
};

module.exports = rateLimitHelper;