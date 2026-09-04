// const { logData } = require("../../client/src/utils/console");
const expenseModel = require("../models/expense.model");
const userModel = require("../models/user.model");
const notification = require("../services/expenses/notification");
const { initPayout } = require("../services/payments/payout");
const { checkPayout } = require("./webhook.controllers");


const addExpense = async (req, res) => {
    // console.log("expense front client", req.params);
    const addData = req.body.addData;
    const userId = req.params.userId
    // console.log("addData", addData)
    console.log("userId", userId)

    try {
        const addPayload = {
            name: addData.name ,
            description: addData.description ,
            phoneNumber: addData.phoneNumber ,
            countryName: addData.countryName ,
            countryCode: addData.countryCode ,
            countryIso: addData.countryIso ,
            amount: addData.amount ? parseInt(addData.amount, 10) : 0,
            method: addData.method,
        }
        // console.log("addPayload", addPayload)
        const expense = await expenseModel.addExpense(addPayload)

        const moderators = await userModel.getModerators();
        const initiator = await userModel.getInitiator(userId);
        const url = process.env.APPROVE_EXPENSE;
        const aprove_url = `${url}/${expense.id}`;

        // console.log("aprove_url", aprove_url)
        // console.log("moderators", moderators)
        // console.log("initiator", initiator)
        // const emails = moderators.map(moderator => moderator.email);
        // console.log("emails", emails)
        if(initiator.role === "ADMIN") {
           const results =  await notification.withdrawApproveNotif(moderators, initiator, aprove_url)
           console.log("📨 NOTIFICATIONS RESULTS :", results);
        }
        res.status(200).json({message:"Opération effectuée avec succès !", expense})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur", error: error.message })
    }
}
const updateExpense = async (req, res) => {
    const updateData = req.body.updateData;
    const expenseId = req.params.id;
    const user = req.user;
    const userId = user?.id
    // console.log("updateData", updateData)
    console.log("userId", userId)
    try {
        const updatePayload = {
            name : updateData.name,
            description : updateData.description,
            phoneNumber : updateData.phoneNumber,
            countryName: updateData.countryName ,
            countryCode: updateData.countryCode ,
            countryIso: updateData.countryIso ,
            amount: updateData.amount ? parseInt(updateData.amount, 10) : 0,
            method: updateData.method ,
        }

        const expense = await expenseModel.updateExpense(expenseId, updatePayload)

        const moderators = await userModel.getModerators();
        const initiator = await userModel.getInitiator(userId);
        const url = process.env.APPROVE_EXPENSE;
        const aprove_url = `${url}/${expense.id}`;

        // const emails = moderators.map(moderator => moderator.email);
        // console.log("emails", emails)
        // console.log("user", user)
        if(initiator.role === "ADMIN") {
            const results = await notification.withdrawApproveNotif(moderators, initiator, aprove_url)
            console.log("📨 NOTIFICATIONS RESULTS :", results);
        }

        // console.log("updateData",updateData)
        // console.log("updatePayload",updatePayload)
        
        res.status(200).json({message:"Opération effectuée avec succès !", expense})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur", error: error.message})
    }
}
const getExpense = async (req, res) => {
    const expenseId = req.params.id
    // logData("expenseId",expenseId)
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

const approveExpense = async (req, res) => {
    const expenseId = req.params.id;
    const moderatorId = req.user.id;
    // console.log("expenseId", expenseId)
    // console.log("moderatorId", moderatorId)
    const ExpenseStatus = [ "APPROVED", "REJECTED", "PROCESSING" , "PAID", ];
    const allowedRoles  = [ "MODERATOR", "ADMIN",];
    try {
        const moderator = await userModel.getModerator(moderatorId);
        if (!allowedRoles .includes(moderator.role)) {
            return res.status(403).json({
                success: false,
                message: "Seuls les modérateurs ou administrateurs peuvent approuver une dépense.",
            });
        };

        const expense = await expenseModel.getApprovalExpense(expenseId);
        if (!expense) {
            return res.status(403).json({
                success: false,
                message: "Dépense introuvable",
            });
        };

        // console.log("expense", expense) 
        if (ExpenseStatus.includes(expense.status)) {
            return res.status(400).json({
            message: `Cette dépense est déjà ${expense.status}`,
        });
        }

        const existingVote = await userModel.getModeratorVote(expenseId, moderatorId);
        if (existingVote && existingVote.status !== "PENDING") {
            return res.status(400).json({
                message: "Vous avez déjà voté pour cette dépense",
                vote: existingVote.status,
            });
        }
        // console.log("existingVote", existingVote)

        const vote = await expenseModel.approveExpense(expenseId, moderatorId);
        const approvedCount =  await expenseModel.countExpenseApprovals(expenseId)
        const rejectedCount =  await expenseModel.countRejectedExpense(expenseId)
        const totalModerator =  await userModel.getTotalModerator();

        const pendingCount = totalModerator - (approvedCount + rejectedCount);
        // Au moins 2/3 des modérateurs doivent approuver
        const requiredApprovals = Math.ceil((totalModerator * 2) / 3);

        let newExpenseStatus = "PENDING";
        if (approvedCount >= requiredApprovals) {
            newExpenseStatus = "APPROVED"
        } else if ((approvedCount + pendingCount) < requiredApprovals) {
            newExpenseStatus = "REJECTED"
        } 

        // console.log("expense", expense)
        if (newExpenseStatus === "APPROVED") {
            
            const payoutdata = {
                countryCode: expense.countryIso ,
                phone : expense.phoneNumber,
                amount: expense.amount ? parseInt(expense.amount, 10) : 0,
                withdraw_mode: expense.method ,
            }
            // console.log("payoutdata", payoutdata)

            const response = await initPayout(payoutdata)
            // console.log("retrait", response)
            const tokenPay = response?.tokenPay
            if (response.statut === true) {
                if (tokenPay ) {
                    const updateData = {status: newExpenseStatus, tokenPay}
                    await expenseModel.updateExpense(expenseId, updateData)
                }
                checkPayout()
            } else {
                return res.status(400).json({
                status: false,
                vote,
                result:{ totalModerator, requiredApprovals, approvedCount, rejectedCount, pendingCount, status: newExpenseStatus},
                message: response.message,
                })
            }
        }


        return res.status(200).json({
            status: true,
            vote,
            result:{ totalModerator, requiredApprovals, approvedCount, rejectedCount, pendingCount, status: newExpenseStatus},
            message: newExpenseStatus === "APPROVED" ? "Dépense approuvée" : "Vote enregistré avec succès",
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "erreur serveur"})
    }
}
const rejectExpense = async (req, res) => {
    const expenseId = req.params.id;
    const moderatorId = req.user.id;
    // console.log("expenseId", expenseId)
    // console.log("moderatorId", moderatorId)
    const ExpenseStatus = [ "APPROVED", "REJECTED", "PROCESSING" , "PAID", ]
    const allowedRoles  = [ "MODERATOR", "ADMIN",]
    try {
        const moderator = await userModel.getModerator(moderatorId);
        if (!allowedRoles .includes(moderator.role)) {
            return res.status(403).json({
                success: false,
                message: "Seuls les modérateurs ou administrateurs peuvent rejeter une dépense.",
            });
        };

        const expense = await expenseModel.getApprovalExpense(expenseId);
        if (!expense) {
            return res.status(403).json({
                success: false,
                message: "Dépense introuvable",
            });
        };

        // console.log("expense", expense) 
        if (ExpenseStatus.includes(expense.status)) {
            return res.status(400).json({
            message: `Cette dépense est déjà ${expense.status}`,
        });
        }

        const existingVote = await userModel.getModeratorVote(expenseId, moderatorId);
        if (existingVote && existingVote.status !== "PENDING") {
            return res.status(400).json({
                message: "Vous avez déjà voté pour cette dépense",
                vote: existingVote.status,
            });
        }
        // console.log("existingVote", existingVote)

        const vote = await expenseModel.rejectExpense(expenseId, moderatorId);
        const approvedCount =  await expenseModel.countExpenseApprovals(expenseId)
        const rejectedCount =  await expenseModel.countRejectedExpense(expenseId)
        const totalModerator =  await userModel.getTotalModerator();

        const pendingCount = totalModerator - (approvedCount + rejectedCount);
        // Au moins 2/3 des modérateurs doivent approuver
        const requiredApprovals = Math.ceil((totalModerator * 2) / 3);

        let newExpenseStatus = "PENDING";
        if (approvedCount >= requiredApprovals) {
            newExpenseStatus = "APPROVED"
        } else if ((approvedCount + pendingCount) < requiredApprovals) {
            newExpenseStatus = "REJECTED"
        }

        console.log("newExpenseStatus", newExpenseStatus)
        if (newExpenseStatus === "APPROVED") {
            
            const payoutdata = {
                countryCode: expense.countryIso ,
                phone : expense.phoneNumber,
                amount: expense.amount ? parseInt(expense.amount, 10) : 0,
                withdraw_mode: expense.method ,
            }
            // console.log("payoutdata", payoutdata)
            
            const response = await initPayout(payoutdata)
            // console.log("retrait", response)

            const tokenPay = response?.tokenPay
            if (response.statut === true) {
                if (tokenPay ) {
                    const updateData = {status: newExpenseStatus, tokenPay}
                    await expenseModel.updateExpense(expenseId, updateData)
                }
                checkPayout()
            } else {
                return res.status(400).json({
                status: false,
                vote,
                result:{ totalModerator, requiredApprovals, approvedCount, rejectedCount, pendingCount, status: newExpenseStatus},
                message: response.message,
                })
            }
        }

        return res.status(200).json({
            status: true,
            vote,
            result:{ totalModerator, requiredApprovals, approvedCount, rejectedCount, pendingCount, status: newExpenseStatus},
            message: newExpenseStatus === "REJECTED" ? "Dépense rejetée" : "Vote enregistré avec succès",
        })
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
    approveExpense,
    rejectExpense,
}