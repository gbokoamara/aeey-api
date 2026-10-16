

// Transforme page + limit en skip + take pour Prisma.
// Sans page, renvoie {} : l'ancien comportement (toute la liste) est conservé.
const paginate = (page, limit = 10) => {
  if (!page) return {};

  const safePage = Math.max(parseInt(page) || 1, 1);
  const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);

  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
};

module.exports = { paginate }; // si tu utilises import/export : export const paginate = ...