
// Découpe "gboko yao" → { firstName: "gboko", lastName: "yao" }
// Le premier mot = prénom, le reste = nom
const splitName = (fullName = "") => {
    const parts = String(fullName).trim().replace(/\s+/g, " ").split(" ").filter(Boolean);

    if (parts.length < 2) return null; // il faut au moins un prénom et un nom

    return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
    };
};

// Détecte les faux numéros : 0000000000, 1111111111, 1234567890...
const isFakeNumber = (number) => {
    const digits = String(number).replace(/\D/g, "");

    // Tous les chiffres identiques (0000000000, 1111111111, 222222222...)
    if (/^(\d)\1+$/.test(digits)) return true;

    // Suites croissantes / décroissantes (0123456789, 1234567890, 9876543210...)
    const asc = "01234567890123456789";
    const desc = "98765432109876543210";
    if (asc.includes(digits) || desc.includes(digits)) return true;

    return false;
};

module.exports = {
    splitName,
    isFakeNumber,
}