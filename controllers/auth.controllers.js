// const { logData } = require("../../client/src/utils/console")
const authModel = require("../models/auth.model")
const passwordModel = require("../models/password.model")
const notification = require("../services/expenses/notification")
const { sendOtp } = require("../services/expenses/notification")
const { normalizePhone } = require("../utils/memberNumber")
const {hashePassword, comparePassword} = require("../utils/password")
const {generateToken, generateResetToken} = require("../utils/token")

const login = async (req, res) => {
    const data = req.body.data
    
    try {
        // Vérification du numéro
        const number = normalizePhone(data.number);

        if (!number) {
            return res.status(400).json({
                message: "Le numéro de téléphone doit contenir au moins 8 chiffres."
            });
        }
        
        // connexion
        let token = {};
        let user = await authModel.login(number)
         
        // si user n'existe pas → on crée un compte
        if (!user) {
            return res.status(400).json({
                message: "L'utilisateur ne dispose pas encore de compte, veuillez vous inscrire !"
            });
        }

        // generer le token 
        if (user) { token = await generateToken(user);}

        if (!token) {
            return res.status(401).json({message: "Token manquant !"})
        };

        return res.status(201).json({message:"Connexion succès !", user, token})

    } catch (error) {
        console.log("error", error)
        return res.status(500).json({message: error.message || "error login"})
    }
}

const   register = async (req, res) => {
    const data = req.body.data
    console.log("data", data)
    
    try {
        // Vérification du numéro
        const number = normalizePhone(data.number);

        if (!number) {
            return res.status(400).json({
                message: "Le numéro de téléphone doit contenir au moins 8 chiffres."
            });
        }

        const registerData = {
            number,
            countryName: data.countryName,
            countryCode: data.countryCode,
            countryIso: data.countryIso,
        }
         
        let user = await authModel.login(number)
         
        // si user n'existe pas → on crée un compte
        if (user) {
            return res.status(400).json({
                message: " Vous avez déjà un compte, veuillez vous connecter !"
            });
        }
        
        // console.log("registerData", registerData)
        user =  await authModel.register(registerData)

        // generer le token 
        if (user) { token = await generateToken(user);}

        if (!token) {
            return res.status(401).json({message: "Token manquant !"})
        };
        
        return res.status(201).json({message:"Compte creé avec succès et connexion reussie !", user, token})

    } catch (error) {
        console.log("error", error)
        return res.status(500).json({message: error.message || "register login"})
    }
}

const   password = async (req, res) => {
    const {password} = req.body;
    const {id} = req.params;
    try {

        const user = await authModel.getUser(id);
        if (!user) {
            return res.status(404).json({message: "Aucun utilisateur trouvé"})
        }

        if (user.havePass) {
            return res.status(400).json({message: "Mot de passe déjà défini"})
        }

        const hashedPassword = await hashePassword(password);

        const updateUser = await authModel.updateUser(id, {
            password: hashedPassword,
            havePass: true,
        })

         const tokken = generateToken(updateUser);

         return res.status(200).json({message: "Mot de passe ajouté avec succès", tokken,  user: updateUser})
    } catch (error) {
         return res.status(500).json({message: error.message || "Erreur ajout mot de passe ", })
    }
};

const   passwordLogin = async (req, res) => {
    const {password} = req.body;
    const {id} = req.params;
    try {

        const user = await authModel.getUser(id);
        // Utilisateur introuvable
        if (!user) {
            return res.status(404).json({message: "Aucun utilisateur trouvé"})
        }

        const userPassword = user.password;
        const isMatch = await comparePassword(password, userPassword);
        // Mot de passe incorect
        if (!isMatch) {
            return res.status(201).json({message: "Mot de passe incorect", isMatch})
         }
        //  Mot de passe corect
         return res.status(200).json({message: "Mot de passe verifié", isMatch})
    } catch (error) {
         res.status(500).json({message: error.message || "Erreur verification de  mot de passe ",})
    }
}

const   forgotPassword = async (req, res) => {
    const {password}  = req.body;
    const user = req?.user;
    try {
        
        // Verification de l'existance de l'utilisateur
        const existingUser = await authModel.getUser(user?.id);
        if (!existingUser) {
            return res.status(404).json({message: "Aucun utilisateur trouvé"})
        };

        const hashedPassword = await hashePassword(password);
        const token = generateResetToken(existingUser, hashedPassword)
        const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`

        if (!token) {
            return res.status(404).json({message: "Aucun token trouvé"})
        }

        const email = existingUser.email;
        const name = existingUser.firstName;
        if (!email) {
         return res.status(403).json({message: "Aucun Email trouvé"})
        }

        // Expiration : 1 heure
        const expiresAt = new Date(
            Date.now() + 60 * 60 * 1000
        );

         // Supprimer les anciens tokens de cet utilisateur
         await passwordModel.deleteUserPasswordResets(existingUser?.id)

         // Enregistrer le nouveau reset
         await passwordModel.createPasswordReset({
            userId:existingUser?.id,
            token,
            passwordHash: hashedPassword,
            expiresAt
         })
        
        
          // Notification
        const results =  await notification.resetPassword(email, name, url)
        console.log("📨 NOTIFICATIONS RESULTS :", results);
        
    
         res.status(200).json({message: "Lien de réinitialisation généré"})
    } catch (error) {
       return  res.status(500).json({message: error.message || "Erreur modification de  mot de passe ", error: error.message})
    }
}

const resetPassword = async (req, res) => {
    const { token } = req.body;
    try {

        const reset = await passwordModel.getPasswordResetByToken(token)

        if (!reset) {
            return res.status(400).json({message: "Ce token n'existe pas, reprenez la reinitialisation du code pin"})
        }

        // Vérifier si déjà utilisé
        if (reset.used) {
            return res.status(400).json({
                message: "Ce token a déjà été utilisé"
            });
        }

        // Vérifier expiration
        if (new Date() > reset.expiresAt) {
            await passwordModel.deletePasswordReset(reset.id)

            return res.status(400).json({
                message: "Le token a expiré"
            });
        }

        // Mettre à jour le mot de passe
        await authModel.updateUser(reset.userId, {password: reset.passwordHash})
        
        // Invalider le token
        await passwordModel.deletePasswordReset(reset.id)
    
        return res.status(200).json({
            message: "Mot de passe réinitialisé avec succès"
        });

    } catch (error) {
        return  res.status(500).json({message: error.message || "Erreur de réinitialisé de  mot de passe ", error: error.message})

    }
};

module.exports = {login, register, password, passwordLogin, forgotPassword, resetPassword }