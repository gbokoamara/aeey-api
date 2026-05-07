
module.exports = {
// Générer un numéro membre simple (ex: AEEY-2026-XXXX)
generateMemberNumber : () => {
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      return `AEEY-${year}-${random}`;
    },
}