/**
 * Générateur d'identifiants aléatoires alphanumériques.
 * Exemple: A7B9X2Z4
 */
const crypto = require('crypto');

function generateRandomId(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += chars.charAt(bytes[i] % chars.length);
    }
    return result;
}

module.exports = { generateRandomId };
