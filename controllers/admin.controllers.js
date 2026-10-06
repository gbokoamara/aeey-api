
const userModel = require("../models/user.model")
const adminModel = require("../models/admin.model")


module.exports = {
    createModerator: async (req, res) => {
        const user = req.user ;
        const userId = user.id ;
        const email = req.body.addData
        try {

            const existingUser = userModel.getProfil(userId) ;

            if (!existingUser) {
                return res.status(404).json({message : "Aucun utilisateur trouvé "})
            } ;

            const user = await userModel.getUserByEmail(email)
  
            //verification de l'existance de l'utilisateur
            if (!user) {
                return res.status(400).json({message: "L'utilisateur que vous souhaitez ajouter n'existe pas !"})
            }

            //verification de l'existance de moderateur
            if (user.role === "MODERATOR") {
                return res.status(400).json({message: "Le moderateur que vous souhaitez ajouter existe déjà !"})
            };

            //verification de l'existance administrateur
            if (user.role === "ADMIN") {
                return res.status(400).json({message: "Le moderateur que vous souhaitez ajouter existe déjà !"})
            };

            const moderator = await adminModel.updateUser(user.id, {role:"MODERATOR"})

            res.status(200).json({message: "Moderateur ajouté avec succès ", moderator})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Erreur server", error: error.message})
        }
    },
    getModerator: async (req, res) => {
        try {
            const moderator = await userModel.getModerators()
            res.status(200).json({message: "Requette success", moderator})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Erreur server", error: error.message})
        }
    },
    getModerators: async (req, res) => {
        try {
            const moderators = await userModel.getModerators()
            res.status(200).json({message: "Requette success", moderators})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Erreur server", error: error.message})
        }
    },
    removeModerator: async (req, res) => {
         const user = req.user ;
        const userId = user.id ;
        const id = req.body.id
        try {

            const existingUser = userModel.getProfil(userId) ;

            if (!existingUser) {
                return res.status(404).json({message : "Aucun utilisateur trouvé "})
            } ;

            const existingModerator = await userModel.getModerator(id)
            
            //verification de l'existance de l'utilisateur
            if (!existingModerator) {
                return res.status(400).json({message: "Le moderateur que vous souhaitez retirer n'existe pas !"})
            }

            //verification de l'existance de moderateur
            if (existingModerator.role !== "MODERATOR") {
                return res.status(400).json({message: "L'utilisateur que vous souhaitez retirer n'est  pas moderateur !"})
            }
             
            const moderator = await userModel.update(existingModerator.id, {role: "MEMBER"})

            res.status(200).json({message: "Moderateur supprimé avec succès ", moderator})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Erreur server", error: error.message})
        }
    },

    manage: async (req, res) => {
        const user = req.user ;
        const userId = user.id ;

        const {config, value} = req.body.addData
         const allowedConfigs = ["initialBalance", "cardAmount", "payInFee", "payOutFee",]

        try {
            
            const existingUser = userModel.getProfil(userId) ;

            if (!existingUser) {
                return res.status(404).json({message : "Aucun utilisateur trouvé "})
            } ;

            let payloadData = {}

            if (allowedConfigs.includes(config)) {
                payloadData = {
                    [config]: value,
                }
            }
            const stats = await adminModel.management(payloadData)
            res.status(200).json({message: "Requette success", stats})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Erreur server", error: error.message})
        }
    },
    
    getManagement: async (req, res) => {
        try {
            const tresaury = await adminModel.getManagement()
            if (!tresaury) {
                return res.status(200).json({ message : "Aucune tresorerie trouvée !"})
            }
            return res.status(200).json({message:"Recuperation de la tresaurerie avec succès", tresaury})
        } catch (error) {
            console.error(error);
            return res.status(500).json({message: "Erreur server", error: error.message}) 
        }
    }
}