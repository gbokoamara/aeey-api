const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const generateToken = async (user) => {
    return jwt.sign(
        {id: user.id, number:user.number},
        process.env.JWT_SECRET,
        {expiresIn: "2d"}
    )
}

const generateResetToken = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < 10; i++) {
        token += chars.charAt(
            crypto.randomInt(0, chars.length)
        );
    }
    return token;
};

const generatePasswordResetJwt = async (user, newPassword) => {
    const resetToken = generateResetToken();

    return jwt.sign(
        {
            id: user.id,
            number: user.number,
            resetToken,
            newPassword
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

module.exports = {generateToken, generateResetToken, generatePasswordResetJwt}