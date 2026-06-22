const { generateMemberNumber } = require("./memberNumber");

const buildCardData = (user) => {
  const base = {
    userId: user.id,
    nom: user.firstName,
    prenoms: user.lastName,
    photo: user.photo,
    code: generateMemberNumber(),
    status: "EN_ATTENTE",
    date: new Date().toLocaleDateString("fr-FR"),
    poste: user.poste || "Membre actif",
    memberType: user.memberType, // directement depuis user
  };

  switch (user.memberType) {
    case "ELEVE":
    case "ETUDIANT":
      return {
        ...base,
        organisation: user.etablissement,
        classe: user.niveau,
        detail: user.filiere,
        matricule: user.matricule,
      };

    case "PROFESSIONNEL":
      return {
        ...base,
        organisation: user.entreprise,
        classe: user.occupation,
        detail: null,
        matricule: null,
      };

    default: // "MEMBRE"
      return {
        ...base,
        organisation: user.section || null,
        classe: null,
        detail: null,
        matricule: null,
      };
  }
};

module.exports = {buildCardData}