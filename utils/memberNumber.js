module.exports = {
  // Générer un numéro membre simple (ex: AEEY-2026-XXXX)
  generateMemberNumber: () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `AEEY-${year}-${random}`;
  },

  normalizePhone: (number) => {
    if (!number) return null;

    // Convertir en string et supprimer tout ce qui n'est pas un chiffre
    const normalized = String(number).replace(/\D/g, "");

    // Au moins 8 chiffres
    if (normalized.length < 10) {
      return null;
    }

    return normalized;
  },
};
