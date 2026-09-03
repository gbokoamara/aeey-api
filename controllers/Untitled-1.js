

/**
 * APPROUVER UNE DEPENSE
 *
 * Règle :
 * - seuls les MODERATOR peuvent voter
 * - au moins 2/3 des modérateurs doivent approuver
 * - le nombre requis est arrondi à l'entier supérieur
 *
 * Exemple :
 * 3 modérateurs => 2 approbations
 * 6 modérateurs => 4 approbations
 */
const approveExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const moderatorId = req.user.id;

        // --------------------------------------------------
        // 1. Vérifier que l'utilisateur est un MODERATOR
        // --------------------------------------------------

        if (req.user.role !== "MODERATOR") {
            return res.status(403).json({
                success: false,
                message: "Seuls les modérateurs peuvent approuver une dépense.",
            });
        }

        // --------------------------------------------------
        // 2. Transaction
        // --------------------------------------------------

        const result = await prisma.$transaction(async (tx) => {

            // ----------------------------------------------
            // Récupérer la dépense
            // ----------------------------------------------

            const expense = await tx.expense.findUnique({
                where: {
                    id: expenseId,
                },
                include: {
                    payment: true,
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            number: true,
                        },
                    },
                    approvals: true,
                },
            });

            if (!expense) {
                throw {
                    status: 404,
                    message: "Dépense introuvable.",
                };
            }

            // ----------------------------------------------
            // La dépense doit être PENDING
            // ----------------------------------------------

            if (expense.status !== "PENDING") {
                throw {
                    status: 400,
                    message:
                        `Cette dépense ne peut plus être approuvée. ` +
                        `Statut actuel : ${expense.status}`,
                };
            }

            // ----------------------------------------------
            // Récupérer les modérateurs
            // ----------------------------------------------

            const moderators = await tx.user.findMany({
                where: {
                    role: "MODERATOR",
                },
                select: {
                    id: true,
                },
            });

            const moderatorCount = moderators.length;

            if (moderatorCount === 0) {
                throw {
                    status: 400,
                    message: "Aucun modérateur n'est disponible.",
                };
            }

            // ----------------------------------------------
            // Vérifier que le demandeur est bien un modérateur
            // ----------------------------------------------

            const isModerator = moderators.some(
                (moderator) => moderator.id === moderatorId
            );

            if (!isModerator) {
                throw {
                    status: 403,
                    message: "Vous n'êtes pas autorisé à voter.",
                };
            }

            // ----------------------------------------------
            // Calcul du nombre d'approbations nécessaires
            // 2/3 arrondi vers le haut
            // ----------------------------------------------

            const requiredApprovals = Math.ceil(
                (moderatorCount * 2) / 3
            );

            // ----------------------------------------------
            // Vérifier si ce modérateur a déjà voté
            // ----------------------------------------------

            const existingApproval = await tx.expenseApproval.findUnique({
                where: {
                    expenseId_moderatorId: {
                        expenseId,
                        moderatorId,
                    },
                },
            });

            if (existingApproval) {

                if (existingApproval.status === "APPROVED") {
                    throw {
                        status: 400,
                        message: "Vous avez déjà approuvé cette dépense.",
                    };
                }

                if (existingApproval.status === "REJECTED") {
                    throw {
                        status: 400,
                        message:
                            "Vous avez déjà rejeté cette dépense et ne pouvez plus modifier votre vote.",
                    };
                }

                // Si le statut est PENDING, on le transforme en APPROVED
                await tx.expenseApproval.update({
                    where: {
                        id: existingApproval.id,
                    },
                    data: {
                        status: "APPROVED",
                        approvedAt: new Date(),
                    },
                });

            } else {

                // ------------------------------------------
                // Première décision de ce modérateur
                // ------------------------------------------

                await tx.expenseApproval.create({
                    data: {
                        expenseId,
                        moderatorId,
                        status: "APPROVED",
                        approvedAt: new Date(),
                    },
                });
            }

            // ----------------------------------------------
            // Recompter les votes après l'approbation
            // ----------------------------------------------

            const approvalCount = await tx.expenseApproval.count({
                where: {
                    expenseId,
                    status: "APPROVED",
                },
            });

            const rejectionCount = await tx.expenseApproval.count({
                where: {
                    expenseId,
                    status: "REJECTED",
                },
            });

            const pendingCount =
                moderatorCount -
                approvalCount -
                rejectionCount;

            // ----------------------------------------------
            // Vérifier si le seuil est atteint
            // ----------------------------------------------

            const isApproved =
                approvalCount >= requiredApprovals;

            // ----------------------------------------------
            // Vérifier si atteindre le seuil est encore
            // possible
            // ----------------------------------------------

            const maximumPossibleApprovals =
                approvalCount + pendingCount;

            const approvalImpossible =
                maximumPossibleApprovals < requiredApprovals;

            // ----------------------------------------------
            // CAS 1 : APPROUVÉ
            // ----------------------------------------------

            if (isApproved) {

                // Vérifier qu'aucun paiement n'existe déjà
                let payment = await tx.payment.findUnique({
                    where: {
                        expenseId: expense.id,
                    },
                });

                // ------------------------------------------
                // Créer le Payment UNE SEULE FOIS
                // ------------------------------------------

                if (!payment) {
                    payment = await tx.payment.create({
                        data: {
                            userId: expense.createdById,
                            name: expense.name,
                            phoneNumber: expense.phoneNumber,
                            amount: expense.amount,
                            type: "WITHDRAW",
                            method: expense.method,
                            description: expense.description,
                            status: "PENDING",
                            expenseId: expense.id,
                        },
                    });
                }

                // ------------------------------------------
                // Passer la dépense à PROCESSING
                // ------------------------------------------

                const updatedExpense = await tx.expense.update({
                    where: {
                        id: expense.id,
                    },
                    data: {
                        status: "PROCESSING",
                    },
                    include: {
                        approvals: {
                            include: {
                                moderator: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                        payment: true,
                        createdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                number: true,
                            },
                        },
                    },
                });

                return {
                    type: "APPROVED",
                    expense: updatedExpense,
                    payment,
                    moderatorCount,
                    requiredApprovals,
                    approvalCount,
                    rejectionCount,
                    pendingCount,
                };
            }

            // ----------------------------------------------
            // CAS 2 : IMPOSSIBLE D'ATTEINDRE 2/3
            // ----------------------------------------------

            if (approvalImpossible) {

                const updatedExpense = await tx.expense.update({
                    where: {
                        id: expense.id,
                    },
                    data: {
                        status: "REJECTED",
                    },
                    include: {
                        approvals: {
                            include: {
                                moderator: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                        createdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                number: true,
                            },
                        },
                    },
                });

                return {
                    type: "REJECTED",
                    expense: updatedExpense,
                    payment: null,
                    moderatorCount,
                    requiredApprovals,
                    approvalCount,
                    rejectionCount,
                    pendingCount,
                };
            }

            // ----------------------------------------------
            // CAS 3 : TOUJOURS EN ATTENTE
            // ----------------------------------------------

            const updatedExpense = await tx.expense.findUnique({
                where: {
                    id: expense.id,
                },
                include: {
                    approvals: {
                        include: {
                            moderator: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    role: true,
                                },
                            },
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            number: true,
                        },
                    },
                },
            });

            return {
                type: "PENDING",
                expense: updatedExpense,
                payment: null,
                moderatorCount,
                requiredApprovals,
                approvalCount,
                rejectionCount,
                pendingCount,
            };
        });

        // --------------------------------------------------
        // Réponse selon le résultat
        // --------------------------------------------------

        if (result.type === "APPROVED") {
            return res.status(200).json({
                success: true,
                message:
                    "Le nombre requis d'approbations a été atteint. " +
                    "La dépense est maintenant en cours de traitement.",
                data: result,
            });
        }

        if (result.type === "REJECTED") {
            return res.status(200).json({
                success: true,
                message:
                    "La dépense a été automatiquement rejetée car " +
                    "le seuil des 2/3 d'approbations ne peut plus être atteint.",
                data: result,
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Votre approbation a été enregistrée. " +
                `${result.approvalCount}/${result.requiredApprovals} ` +
                "approbations nécessaires.",
            data: result,
        });

    } catch (error) {

        console.error("approveExpense error:", error);

        if (error.status) {
            return res.status(error.status).json({
                success: false,
                message: error.message,
            });
        }

        // Prisma unique constraint
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message:
                    "Votre vote existe déjà ou la dépense vient d'être traitée par un autre modérateur.",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Une erreur est survenue lors de l'approbation de la dépense.",
            error: error.message,
        });
    }
};


/**
 * REJETER UNE DEPENSE
 *
 * Le rejet d'un modérateur ne rejette PAS immédiatement
 * la dépense.
 *
 * La dépense est rejetée seulement lorsque le seuil
 * des 2/3 d'approbations devient impossible à atteindre.
 */
const rejectExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const moderatorId = req.user.id;

        const { comment } = req.body;

        // --------------------------------------------------
        // 1. Vérifier le rôle
        // --------------------------------------------------

        if (req.user.role !== "MODERATOR") {
            return res.status(403).json({
                success: false,
                message: "Seuls les modérateurs peuvent rejeter une dépense.",
            });
        }

        const result = await prisma.$transaction(async (tx) => {

            // ----------------------------------------------
            // Récupérer la dépense
            // ----------------------------------------------

            const expense = await tx.expense.findUnique({
                where: {
                    id: expenseId,
                },
                include: {
                    payment: true,
                },
            });

            if (!expense) {
                throw {
                    status: 404,
                    message: "Dépense introuvable.",
                };
            }

            // ----------------------------------------------
            // Vérifier le statut
            // ----------------------------------------------

            if (expense.status !== "PENDING") {
                throw {
                    status: 400,
                    message:
                        `Cette dépense ne peut plus être rejetée. ` +
                        `Statut actuel : ${expense.status}`,
                };
            }

            // ----------------------------------------------
            // Récupérer tous les modérateurs
            // ----------------------------------------------

            const moderators = await tx.user.findMany({
                where: {
                    role: "MODERATOR",
                },
                select: {
                    id: true,
                },
            });

            const moderatorCount = moderators.length;

            if (moderatorCount === 0) {
                throw {
                    status: 400,
                    message: "Aucun modérateur n'est disponible.",
                };
            }

            // ----------------------------------------------
            // Vérifier que l'utilisateur est modérateur
            // ----------------------------------------------

            const isModerator = moderators.some(
                (moderator) => moderator.id === moderatorId
            );

            if (!isModerator) {
                throw {
                    status: 403,
                    message: "Vous n'êtes pas autorisé à voter.",
                };
            }

            // ----------------------------------------------
            // Calcul du seuil
            // ----------------------------------------------

            const requiredApprovals = Math.ceil(
                (moderatorCount * 2) / 3
            );

            // ----------------------------------------------
            // Vérifier si le modérateur a déjà voté
            // ----------------------------------------------

            const existingApproval = await tx.expenseApproval.findUnique({
                where: {
                    expenseId_moderatorId: {
                        expenseId,
                        moderatorId,
                    },
                },
            });

            if (existingApproval) {

                if (existingApproval.status === "REJECTED") {
                    throw {
                        status: 400,
                        message: "Vous avez déjà rejeté cette dépense.",
                    };
                }

                if (existingApproval.status === "APPROVED") {
                    throw {
                        status: 400,
                        message:
                            "Vous avez déjà approuvé cette dépense et ne pouvez plus modifier votre vote.",
                    };
                }

                // PENDING → REJECTED
                await tx.expenseApproval.update({
                    where: {
                        id: existingApproval.id,
                    },
                    data: {
                        status: "REJECTED",
                        comment: comment || null,
                    },
                });

            } else {

                // ------------------------------------------
                // Créer le rejet
                // ------------------------------------------

                await tx.expenseApproval.create({
                    data: {
                        expenseId,
                        moderatorId,
                        status: "REJECTED",
                        comment: comment || null,
                    },
                });
            }

            // ----------------------------------------------
            // Recompter les votes
            // ----------------------------------------------

            const approvalCount = await tx.expenseApproval.count({
                where: {
                    expenseId,
                    status: "APPROVED",
                },
            });

            const rejectionCount = await tx.expenseApproval.count({
                where: {
                    expenseId,
                    status: "REJECTED",
                },
            });

            const pendingCount =
                moderatorCount -
                approvalCount -
                rejectionCount;

            // ----------------------------------------------
            // Nombre maximum d'approbations encore possible
            // ----------------------------------------------

            const maximumPossibleApprovals =
                approvalCount + pendingCount;

            const approvalImpossible =
                maximumPossibleApprovals < requiredApprovals;

            // ----------------------------------------------
            // La dépense doit-elle être rejetée ?
            // ----------------------------------------------

            if (approvalImpossible) {

                const updatedExpense = await tx.expense.update({
                    where: {
                        id: expense.id,
                    },
                    data: {
                        status: "REJECTED",
                    },
                    include: {
                        approvals: {
                            include: {
                                moderator: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        role: true,
                                    },
                                },
                            },
                        },
                        createdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                number: true,
                            },
                        },
                    },
                });

                return {
                    type: "REJECTED",
                    expense: updatedExpense,
                    moderatorCount,
                    requiredApprovals,
                    approvalCount,
                    rejectionCount,
                    pendingCount,
                };
            }

            // ----------------------------------------------
            // Encore possible d'obtenir les 2/3
            // ----------------------------------------------

            const updatedExpense = await tx.expense.findUnique({
                where: {
                    id: expense.id,
                },
                include: {
                    approvals: {
                        include: {
                            moderator: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    role: true,
                                },
                            },
                        },
                    },
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            number: true,
                        },
                    },
                },
            });

            return {
                type: "PENDING",
                expense: updatedExpense,
                moderatorCount,
                requiredApprovals,
                approvalCount,
                rejectionCount,
                pendingCount,
            };
        });

        // --------------------------------------------------
        // Réponse
        // --------------------------------------------------

        if (result.type === "REJECTED") {
            return res.status(200).json({
                success: true,
                message:
                    "La dépense est rejetée. Le seuil des 2/3 " +
                    "d'approbations ne peut plus être atteint.",
                data: result,
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Votre rejet a été enregistré. " +
                `${result.approvalCount}/${result.requiredApprovals} ` +
                "approbations nécessaires.",
            data: result,
        });

    } catch (error) {

        console.error("rejectExpense error:", error);

        if (error.status) {
            return res.status(error.status).json({
                success: false,
                message: error.message,
            });
        }

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message:
                    "Votre vote existe déjà ou la dépense vient d'être traitée par un autre modérateur.",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Une erreur est survenue lors du rejet de la dépense.",
            error: error.message,
        });
    }
};


module.exports = {
    approveExpense,
    rejectExpense,
};