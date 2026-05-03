const bcrypt = require('bcrypt')

const hashePassword  =  (password) => {
    return bcrypt.hash(password, 10)
};

const comparePassword  =  (password, userPassword) => {
    return bcrypt.compare(password, userPassword)
}


module.exports = {hashePassword, comparePassword}