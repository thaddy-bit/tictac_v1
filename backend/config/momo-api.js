// Configuration MTN Mobile Money API
// Basée sur la documentation: https://momodeveloper.mtn.com/api-documentation

const momoConfig = {
    primaryKey: process.env.MOMO_PRIMARY_KEY || '',
    secondaryKey: process.env.MOMO_SECONDARY_KEY || '',
    
    // URLs de l'API MTN MOMO (Sandbox pour développement)
    sandbox: {
        baseURL: 'https://sandbox.momodeveloper.mtn.com',
        tokenURL: 'https://sandbox.momodeveloper.mtn.com/oauth/token',
        collectionURL: 'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
        remittanceURL: 'https://sandbox.momodeveloper.mtn.com/remittance/v1_0/transfer',
        disbursementURL: 'https://sandbox.momodeveloper.mtn.com/disbursement/v1_0/transfer'
    },
    
    // URLs de production (à utiliser en production)
    production: {
        baseURL: 'https://momodeveloper.mtn.com',
        tokenURL: 'https://momodeveloper.mtn.com/oauth/token',
        collectionURL: 'https://momodeveloper.mtn.com/collection/v1_0/requesttopay',
        remittanceURL: 'https://momodeveloper.mtn.com/remittance/v1_0/transfer',
        disbursementURL: 'https://momodeveloper.mtn.com/disbursement/v1_0/transfer'
    },
    
    // Configuration de l'environnement
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    
    // Informations sur le marchand (à configurer)
    merchant: {
        // UUID du marchand (généré lors de la création du compte)
        uuid: process.env.MOMO_MERCHANT_UUID || '',
        
        // Informations de la boutique
        storeName: 'Tictac Platform',
        storeLogo: 'https://votre-domaine.com/logo.png',
        
        // Callback URLs (webhooks)
        callbackHost: process.env.MOMO_CALLBACK_HOST || 'http://localhost:5000',
        returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/payment/success',
        cancelUrl: process.env.MOMO_CANCEL_URL || 'http://localhost:3000/payment/cancel'
    },
    
    // Configuration des requêtes
    requestConfig: {
        // Headers par défaut
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Target-Environment': 'mtncongo' // Environnement MTN Congo
        },
        
        // Timeout en millisecondes
        timeout: 30000,
        
        // Nombre de tentatives
        retries: 3
    },
    
    // Montants et devises
    currency: {
        code: 'XAF', // Franc CFA
        locale: 'fr-CF'
    },
    
    // Limites de transaction
    limits: {
        minAmount: 100, // 100 XAF minimum
        maxAmount: 500000, // 500 000 XAF maximum
        dailyLimit: 2000000 // 2 000 000 XAF par jour
    }
};

// Fonction pour obtenir l'URL de base selon l'environnement
const getBaseURL = () => {
    return momoConfig[momoConfig.environment].baseURL;
};

// Fonction pour obtenir l'URL de token selon l'environnement
const getTokenURL = () => {
    return momoConfig[momoConfig.environment].tokenURL;
};

// Fonction pour obtenir l'URL de collection selon l'environnement
const getCollectionURL = () => {
    return momoConfig[momoConfig.environment].collectionURL;
};

// Fonction pour obtenir les headers d'authentification
const getAuthHeaders = (accessToken) => {
    return {
        ...momoConfig.requestConfig.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Ocp-Apim-Subscription-Key': momoConfig.primaryKey
    };
};

// Fonction pour obtenir les headers de création de token
const getTokenHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key': momoConfig.primaryKey
    };
};

// Fonction pour valider le montant
const validateAmount = (amount) => {
    if (typeof amount !== 'number' || amount <= 0) {
        throw new Error('Le montant doit être un nombre positif');
    }
    
    if (amount < momoConfig.limits.minAmount) {
        throw new Error(`Le montant minimum est de ${momoConfig.limits.minAmount} XAF`);
    }
    
    if (amount > momoConfig.limits.maxAmount) {
        throw new Error(`Le montant maximum est de ${momoConfig.limits.maxAmount} XAF`);
    }
    
    return true;
};

// Fonction pour formater le montant
const formatAmount = (amount) => {
    return {
        amount: amount.toString(),
        currency: momoConfig.currency.code
    };
};

// Fonction pour créer une référence de transaction unique
const generateTransactionReference = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `TICTAC_${timestamp}_${random}`.toUpperCase();
};

module.exports = {
    momoConfig,
    getBaseURL,
    getTokenURL,
    getCollectionURL,
    getAuthHeaders,
    getTokenHeaders,
    validateAmount,
    formatAmount,
    generateTransactionReference
};
