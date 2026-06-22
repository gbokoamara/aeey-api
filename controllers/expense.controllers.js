const { logData } = require("../../client/src/utils/console");
const expenseModel = require("../models/expense.model")


const addExpense = async (req, res) => {
    logData("expense front client", req.body);
    const addData = req.body.addData;
    
    try {
        const addPayload = {
            name: addData.name ,
            description: addData.description ,
            phoneNumber: addData.phoneNumber ,
            amount: addData.amount ? parseInt(addData.amount, 10) : 0,
            method: addData.method ? addData.method.toUpperCase() :addData.method ,
        }
        logData("addPayload", addPayload)
        const expense = await expenseModel.addExpense(addPayload)
        res.status(200).json({message:"Opération effectuée avec succès !", expense})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur"})
    }
}
const updateExpense = async (req, res) => {
    const updateData = req.body.updateData;
    const expenseId = req.params.id;
    try {
        const updatePayload = {
            name : updateData.name,
            description : updateData.description,
            phoneNumber : updateData.phoneNumber,
            amount: updateData.amount ? parseInt(updateData.amount, 10) : 0,
            method: updateData.method ? updateData.method.toUpperCase() : updateData.method ,
        }
        logData("updateData",updateData)
        logData("updatePayload",updatePayload)
        const expense = await expenseModel.updateExpense(expenseId, updatePayload)
        res.status(200).json({message:"Opération effectuée avec succès !", expense})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur"})
    }
}
const getExpense = async (req, res) => {
    const expenseId = req.params.id
    logData("expenseId",expenseId)
    try {
        const expense = await expenseModel.getExpense(expenseId)
        res.status(200).json({message:"Opération effectuée avec succès !", expense})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur"})
    }
}
const getExpenses = async (req, res) => {
    try {
        const expenses = await expenseModel.getAllExpenses()
        res.status(200).json({message:"Opération effectuée avec succès !", expenses})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur"})
    }
}
const deleteExpense = async (req, res) => {
    const expenseId = req.params.id
    try {
        await expenseModel.deleteExpense(expenseId)
        res.status(200).json({message:"Opération effectuée avec succès !"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur"})
    }
}

module.exports = {
    addExpense,
    updateExpense,
    getExpense,
    getExpenses,
    deleteExpense,
}