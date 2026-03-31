const axios = require('axios');
const logs = require('../config/logger');
const { 
    momoConfig, 
    getBaseURL, 
    getTokenURL, 
    getCollectionURL, 
    getAuthHeaders, 
    getTokenHeaders,
    validateAmount,
    formatAmount,
    generateTransactionReference
} = require('../config/momo-api');

class MOMOService {
    constructor() {
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    /**
     * Obtenir un token d'accès de l'API MTN MOMO
     */
    async getAccessToken() {
        // Vérifier si le token est encore valide
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await axios.post(getTokenURL(), {
                grant_type: 'client_credentials'
            }, {
                headers: getTokenHeaders()
            });

            this.accessToken = response.data.access_token;
            // Le token expire en 1 heure (3600 secondes)
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // -1 minute de marge
            
            logs.info('✅ Token MTN MOMO obtenu avec succès');
            return this.accessToken;

        } catch (error) {
            logs.error('❌ Erreur lors de l\'obtention du token MTN MOMO', { error: error.response?.data || error.message });
            throw new Error('Impossible d\'obtenir le token d\'accès MTN MOMO');
        }
    }

    /**
     * Initialiser une demande de paiement Mobile Money
     */
    async initiatePayment(paymentData) {
        try {
            // Valider les données
            if (!paymentData.amount) {
                paymentData.amount = 500.00; // Montant par défaut
            }
            validateAmount(paymentData.amount);
            
            if (!paymentData.phoneNumber || !paymentData.phoneNumber.match(/^\+242\d{9}$/)) {
                throw new Error('Numéro de téléphone invalide. Format: +242XXXXXXXXX');
            }

            if (!paymentData.medicament_search || paymentData.medicament_search.trim() === '') {
                throw new Error('La recherche de médicament est requise');
            }

            const isDemoMode = process.env.MOMO_MODE !== 'live';
            const transactionReference = generateTransactionReference();

            if (isDemoMode) {
                // Mode démo - simuler une réponse réussie sans appeler l'API MTN
                console.log('🧪 Mode démo: Simulation de paiement MTN MOMO');
                
                return {
                    success: true,
                    transaction_id: transactionReference,
                    payment_reference: transactionReference,
                    amount: paymentData.amount,
                    currency: 'XAF',
                    status: 'pending',
                    message: '🧪 Mode démo: Veuillez valider le paiement sur votre téléphone Mobile Money.',
                    payer_phone: paymentData.phoneNumber,
                    medicament_search: paymentData.medicament_search,
                    created_at: new Date().toISOString()
                };
            }

            // Mode Réel - Appel à l'API MTN MOMO
            const accessToken = await this.getAccessToken();
            
            const response = await axios.post(
                getCollectionURL(),
                {
                    amount: formatAmount(paymentData.amount),
                    currency: 'XAF',
                    externalId: transactionReference,
                    payer: {
                        partyIdType: 'MSISDN',
                        partyId: paymentData.phoneNumber.replace('+', '')
                    },
                    payerMessage: `Paiement Tictac - ${paymentData.medicament_search}`,
                    payeeNote: 'Frais de recherche Tictac'
                },
                {
                    headers: getAuthHeaders(accessToken, transactionReference),
                    timeout: momoConfig.requestConfig.timeout
                }
            );

            console.log('✅ Demande de paiement MTN MOMO envoyée avec succès');

            return {
                success: true,
                transaction_id: transactionReference,
                payment_reference: transactionReference,
                amount: paymentData.amount,
                status: 'pending',
                message: 'Veuillez valider le paiement sur votre téléphone Mobile Money.'
            };

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du paiement MTN MOMO:', error.response?.data || error.message);
            // ... rest of error handling
            
            // Gérer les erreurs spécifiques
            if (error.response?.status === 400) {
                throw new Error('Requête invalide: ' + (error.response?.data?.message || 'Vérifiez les informations fournies'));
            } else if (error.response?.status === 401) {
                throw new Error('Erreur d\'authentification: Veuillez réessayer');
            } else if (error.response?.status === 429) {
                throw new Error('Trop de requêtes: Veuillez réessayer plus tard');
            } else {
                throw new Error('Erreur lors de l\'initialisation du paiement: ' + error.message);
            }
        }
    }

    /**
     * Vérifier le statut d'une transaction
     */
    async checkTransactionStatus(transactionReference) {
        try {
            const accessToken = await this.getAccessToken();
            
            const response = await axios.get(
                `${getCollectionURL()}/${transactionReference}`,
                {
                    headers: getAuthHeaders(accessToken),
                    timeout: momoConfig.requestConfig.timeout
                }
            );

            const status = response.data.status.toLowerCase();
            
            return {
                transaction_id: transactionReference,
                status: status === 'successful' ? 'completed' : status === 'failed' ? 'failed' : 'pending',
                amount: parseFloat(response.data.amount),
                currency: response.data.currency,
                created_at: response.data.creationTime,
                completed_at: response.data.paidTime || null,
                financial_transaction_id: response.data.financialTransactionId || null
            };

        } catch (error) {
            logs.error('❌ Erreur lors de la vérification du statut', { error: error.response?.data || error.message });
            
            if (error.response?.status === 404) {
                throw new Error('Transaction non trouvée');
            } else {
                throw new Error('Erreur lors de la vérification du statut: ' + error.message);
            }
        }
    }

    /**
     * Traiter le webhook de MTN MOMO
     */
    async handleWebhook(webhookData) {
        try {
            logs.info('📥 Webhook MTN MOMO reçu', { webhookData });

            const transactionReference = webhookData.externalId;
            const status = webhookData.status?.toLowerCase();
            
            if (!transactionReference) {
                throw new Error('Référence de transaction manquante');
            }

            // Mettre à jour le statut dans la base de données
            const updateData = {
                status: status === 'successful' ? 'completed' : status === 'failed' ? 'failed' : 'pending',
                completed_at: webhookData.paidTime ? new Date(webhookData.paidTime).toISOString() : null,
                financial_transaction_id: webhookData.financialTransactionId || null
            };

            // Ici vous devriez mettre à jour votre table transactions
            // Exemple: await db.query('UPDATE transactions SET ? WHERE mobile_money_ref = ?', [updateData, transactionReference]);

            logs.info(`✅ Transaction ${transactionReference} mise à jour`, { status: updateData.status });
            
            return {
                success: true,
                transaction_id: transactionReference,
                status: updateData.status
            };

        } catch (error) {
            logs.error('❌ Erreur lors du traitement du webhook', { error: error.message });
            throw error;
        }
    }

    /**
     * Rembourser une transaction (si supporté)
     */
    async refundTransaction(transactionReference, amount) {
        try {
            // Note: Le remboursement nécessite généralement l'API Disbursement
            // et des permissions spéciales
            
            console.log('🔄 Demande de remboursement pour:', transactionReference);
            
            // Implémentation à ajouter selon les besoins
            
            throw new Error('Fonction de remboursement non implémentée');

        } catch (error) {
            console.error('❌ Erreur lors du remboursement:', error.message);
            throw error;
        }
    }
}

module.exports = MOMOService;
