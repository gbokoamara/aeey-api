

const memberModel =require("../models/member.model")
const updateMember = async (req, res) => {

    try {
        res.status(200).json({message:"Opération effectuée avec succès !"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Erreur serveur"})
    }
};
const getMember = async (req, res) => {

    try {
        res.status(200).json({message:"Opération effectuée avec succès !"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Erreur serveur"})
    }
};
const getPendingMember = async (req, res) => {

    try {
        const pendingMembers = await memberModel.getPendingMember()
        res.status(200).json({message:"Opération effectuée avec succès !",  pendingMembers})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Erreur serveur"})
    }
};
const getMembers = async (req, res) => {

    try {
        const members = await memberModel.getMembers()
        res.status(200).json({message:"Opération effectuée avec succès !", members})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Erreur serveur"})
    }
};
const deleteMember = async (req, res) => {

    try {
        res.status(200).json({message:"Opération effectuée avec succès !"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Erreur serveur"})
    }
};

module.exports = {
    getMember,
    getMembers,
    getPendingMember,
    updateMember,
    deleteMember,
}