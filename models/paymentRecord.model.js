const prisma = require("../utils/prisma")


module.exports = {
    addRecord: async (recordPayload) => {
        try {
            const record = await prisma.cotisationRecord.create({data: recordPayload})
            return record
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    updateRecord: async (updatePayload, recordId) => {
        try {
            const updatedRecord = await prisma.cotisationRecord.update({
                where: { id: recordId },
                data: updatePayload
            });
            return updatedRecord
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getRecord: async (recordId) => {
        try {
            const record = await prisma.cotisationRecord.findUnique(
                {where: {id: recordId}}
            )
            return record
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    getRecordsByMemberId: async (memberId) => {
        try {
            const records = await prisma.cotisationRecord.findMany({
                where: {
                memberId:  memberId
            },
            })
            return records
        } catch (error) {
            console.error(error)
            throw error
        }
    },
}