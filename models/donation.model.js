const prisma = require("../utils/prisma")

module.exports = {
    addDonation: async (donPayload) => {
        try {
            const donation = await prisma.donation.create(
                {
                    data: donPayload
                }
            )
            return donation
        } catch (error) {
            console.error("erreur d'ajout de don", error.message)
            throw error
        }
    },

    updateDonation: async (donUpdatePayload, donationId) => {
        try {
            const donation = await prisma.donation.update(
                {
                    where: {id: donationId},
                    data: donUpdatePayload
                }
            )
            return donation
        } catch (error) {
            console.error("erreur d'ajout de don", error.message)
            throw error
        }
    },

    deleteDonation: async (donationId) => {
        try {
            await prisma.donation.delete(
                { where: {id: donationId}, }
            )
        } catch (error) {
            console.error("erreur d'ajout de don", error.message)
            throw error
        }
    },

    getPaidDonations: async () => {
        try {
            const donations = await prisma.donation.findMany(
                {where: {status: true}}
            )
            return donations
        } catch (error) {
            console.error("erreur d'ajout de don", error.message)
            throw error
        }
    },

    getDonations: async () => {
        try {
            const donations = await prisma.donation.findMany(
            )
            return donations
        } catch (error) {
            console.error("erreur d'ajout de don", error.message)
            throw error
        }
    },

    getDonation: async (donationId) => {
        try {
            const donation = await prisma.donation.findUnique(
                {where: {id: donationId}}
            )
            return donation
        } catch (error) {
            console.error("erreur d'ajout de don", error.message)
            throw error
        }
    },
}