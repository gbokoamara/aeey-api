const { logData } = require("../../client/src/utils/console")
const authModel = require("../models/auth.model")
const {hashePassword, comparePassword} = require("../utils/password")
const {generateToken} = require("../utils/token")

const login = async (req, res) => {
    const {firstName, number} = req.body
    logData("datafromfrotend", req.body)
    const registerData = {firstName, number}
    try {
        // attendre la réponse 
        let user = await authModel.login(number)
        if (!user) {
            // si user n'existe pas → on crée
            user =  await authModel.register(registerData)
        }
        res.status(201).json({message:"success login", user})
    } catch (error) {
        res.status(500).json({message: "error login", error: error.message})
    }
}

const   register = (req, res) => {
    res.send("enregistrement en cours ...")
}

const   password = async (req, res) => {
    const {password} = req.body;
    const {id} = req.params;
    logData("password", password)
    logData("id", id)
    try {

        const user = await authModel.getUser(id);
        if (!user) {
            res.status(404).json({message: "Aucun utilisateur trouvé"})
        }

        if (user.havePass) {
            res.status(400).json({message: "Mot de passe déjà défini"})
        }

        const hashedPassword = await hashePassword(password);

        const updateUser = await authModel.updateUser(id, {
            password: hashedPassword,
            havePass: true,
        })

         const tokken = generateToken(updateUser);

         res.status(200).json({message: "Mot de passe ajouté avec succès", tokken,  user: updateUser})
    } catch (error) {
         res.status(500).json({message: "Erreur ajout mot de passe ", error: error.message})
    }
};

const   passwordLogin = async (req, res) => {
    logData("req.body", req.body)
    const {password} = req.body;
    const {id} = req.params;
    logData("password", password)
    logData("id", id)
    try {

        const user = await authModel.getUser(id);
        if (!user) {
            res.status(404).json({message: "Aucun utilisateur trouvé"})
        }

        const userPassword = user.password;
        const isMatch = await comparePassword(password, userPassword);
        
        if (!isMatch) {
            res.status(201).json({message: "Mot de passe incorect", isMatch})
         }
         res.status(200).json({message: "Mot de passe verifié", isMatch})
    } catch (error) {
         res.status(500).json({message: "Erreur verification de  mot de passe ", error: error.message})
    }
}



module.exports = {login, register, password, passwordLogin }