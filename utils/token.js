const jwt = require("jsonwebtoken")

const generateToken = async (user) => {
    return jwt.sign(
        {id: user.id, number:user.number},
        process.env.JWT_SECRET,
        {expiresIn: "2d"}
    )
}

module.exports = {generateToken}