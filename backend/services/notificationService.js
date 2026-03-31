const admin = require('firebase-admin');
const db = require('../config/database');
const logs = require('../config/logger');

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.initializeFirebase();
  }

  // Initialiser Firebase Admin SDK
  initializeFirebase() {
    try {
      // Vérifier si Firebase est déjà initialisé
      if (!admin.apps.length) {
        // Configuration Firebase (à adapter avec vos clés)
        const serviceAccount = {
          "type": process.env.FIREBASE_TYPE || "service_account",
          "project_id": process.env.FIREBASE_PROJECT_ID || "tictac-platform",
          "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "your-private-key-id",
          "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
          "client_email": process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@tictac-platform.iam.gserviceaccount.com",
          "client_id": process.env.FIREBASE_CLIENT_ID || "your-client-id",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://oauth2.googleapis.com/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40tictac-platform.iam.gserviceaccount.com"
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID || "tictac-platform"
        });

        this.isInitialized = true;
        logs.info('Firebase Admin SDK initialized successfully');
      } else {
        this.isInitialized = true;
        logs.info('Firebase Admin SDK already initialized');
      }
    } catch (error) {
      logs.error('Firebase initialization failed', { error: error.message });
      this.isInitialized = false;
    }
  }

  // Enregistrer un token de notification push
  async registerToken(userId, token, deviceInfo = {}) {
    try {
      const result = await db.query(
        `INSERT INTO user_tokens (user_id, token_type, token_value, device_info, is_active)
         VALUES (?, 'fcm', ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE 
         device_info = ?, 
         is_active = TRUE, 
         updated_at = NOW()`,
        [userId, token, JSON.stringify(deviceInfo), JSON.stringify(deviceInfo)]
      );

      logs.info('Push token registered', { userId, token: token.substring(0, 20) + '...' });
      return result;
    } catch (error) {
      logs.error('Token registration failed', { error: error.message, userId });
      throw error;
    }
  }

  // Désenregistrer un token
  async unregisterToken(userId, token) {
    try {
      await db.query(
        'UPDATE user_tokens SET is_active = FALSE WHERE user_id = ? AND token_value = ?',
        [userId, token]
      );

      logs.info('Push token unregistered', { userId, token: token.substring(0, 20) + '...' });
      return true;
    } catch (error) {
      logs.error('Token unregistration failed', { error: error.message, userId });
      throw error;
    }
  }

  // Envoyer une notification push à un utilisateur
  async sendNotification(userId, title, message, data = {}, type = 'system') {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase not initialized');
      }

      // Récupérer les tokens actifs de l'utilisateur
      const tokens = await db.query(
        'SELECT token_value FROM user_tokens WHERE user_id = ? AND is_active = TRUE',
        [userId]
      );

      if (tokens.length === 0) {
        logs.warn('No active tokens found for user', { userId });
        return { success: false, message: 'Aucun token actif trouvé' };
      }

      // Enregistrer la notification dans la base de données
      const notificationResult = await db.query(
        'INSERT INTO notifications (user_id, title, message, type, data, is_read) VALUES (?, ?, ?, ?, ?, 0)',
        [userId, title, message, type, JSON.stringify(data)]
      );

      const notificationId = notificationResult.insertId;

      // Préparer les messages pour chaque token
      const messages = tokens.map(token => ({
        token: token.token_value,
        notification: {
          title: title,
          body: message,
          sound: 'default',
          badge: '1'
        },
        data: {
          notificationId: notificationId.toString(),
          type: type,
          ...data
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            click_action: 'FLUTTER_NOTIFICATION_CLICK'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1
            }
          }
        }
      }));

      // Envoyer les notifications
      const results = await admin.messaging().sendAll(messages);
      
      // Mettre à jour le statut des notifications
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < results.responses.length; i++) {
        const result = results.responses[i];
        
        if (result.success) {
          successCount++;
        } else {
          failureCount++;
          
          // Marquer les tokens invalides comme inactifs
          if (result.error?.code === 'messaging/registration-token-not-registered') {
            await db.query(
              'UPDATE user_tokens SET is_active = FALSE WHERE token_value = ?',
              [tokens[i].token_value]
            );
          }
        }
      }

      // Mettre à jour le statut global de la notification
      // Notification already stored; no extra status update needed

      logs.info('Notification sent', { 
        userId, 
        notificationId, 
        successCount, 
        failureCount,
        title 
      });

      return {
        success: successCount > 0,
        notificationId,
        successCount,
        failureCount,
        totalTokens: tokens.length
      };

    } catch (error) {
      logs.error('Notification sending failed', { 
        error: error.message, 
        userId, 
        title 
      });
      throw error;
    }
  }

  // Envoyer une notification de paiement
  async sendPaymentNotification(userId, transactionId, status, amount) {
    const titles = {
      completed: '💰 Paiement Confirmé!',
      failed: '❌ Paiement Échoué',
      pending: '⏳ Paiement en Cours'
    };

    const messages = {
      completed: `Votre paiement de ${amount} FCFA a été confirmé. Vous pouvez maintenant consulter les résultats de recherche.`,
      failed: `Votre paiement de ${amount} FCFA a échoué. Veuillez réessayer.`,
      pending: `Votre paiement de ${amount} FCFA est en cours de traitement.`
    };

    return await this.sendNotification(
      userId,
      titles[status] || 'Notification Paiement',
      messages[status] || 'Statut de paiement mis à jour',
      { transactionId: transactionId.toString(), status, amount: amount.toString() },
      'payment'
    );
  }

  // Envoyer une notification de recherche
  async sendSearchNotification(userId, medicamentName, pharmaciesCount) {
    return await this.sendNotification(
      userId,
      '🔍 Médicaments Trouvés!',
      `${pharmaciesCount} pharmacies ont trouvé "${medicamentName}". Consultez les détails maintenant.`,
      { medicamentName, pharmaciesCount: pharmaciesCount.toString() },
      'search'
    );
  }

  // Envoyer une notification de pharmacie
  async sendPharmacyNotification(userId, pharmacyName, message) {
    return await this.sendNotification(
      userId,
      `🏪 ${pharmacyName}`,
      message,
      { pharmacyName },
      'system'
    );
  }

  // Obtenir les notifications non lues d'un utilisateur
  async getUnreadNotifications(userId, limit = 20) {
    try {
      const notifications = await db.query(
        `SELECT id, title, message, type, data, created_at 
         FROM notifications 
         WHERE user_id = ? AND is_read = 0
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, limit]
      );

      return notifications.map(notification => ({
        ...notification,
        data: JSON.parse(notification.data || '{}')
      }));
    } catch (error) {
      logs.error('Get notifications failed', { error: error.message, userId });
      throw error;
    }
  }

  // Marquer une notification comme lue
  async markAsRead(userId, notificationId) {
    try {
      await db.query(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [notificationId, userId]
      );

      logs.info('Notification marked as read', { userId, notificationId });
      return true;
    } catch (error) {
      logs.error('Mark notification as read failed', { error: error.message, userId });
      throw error;
    }
  }

  // Marquer toutes les notifications comme lues
  async markAllAsRead(userId) {
    try {
      await db.query(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
        [userId]
      );

      logs.info('All notifications marked as read', { userId });
      return true;
    } catch (error) {
      logs.error('Mark all notifications as read failed', { error: error.message, userId });
      throw error;
    }
  }
}

module.exports = new NotificationService();
