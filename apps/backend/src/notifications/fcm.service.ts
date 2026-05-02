import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const serviceAccount = this.configService.get<string>('FIREBASE_SERVICE_ACCOUNT');
    
    if (serviceAccount) {
      try {
        const decodedServiceAccount = JSON.parse(serviceAccount);
        if (
          !decodedServiceAccount.project_id ||
          !decodedServiceAccount.client_email ||
          !decodedServiceAccount.private_key ||
          decodedServiceAccount.project_id === '...' ||
          decodedServiceAccount.client_email === '...'
        ) {
          this.logger.warn('Firebase service account is placeholder or incomplete. Skipping Firebase initialization.');
          return;
        }

        if (typeof decodedServiceAccount.private_key === 'string') {
          // Most env vars store newlines as escaped "\n"; Firebase expects real newlines.
          decodedServiceAccount.private_key = decodedServiceAccount.private_key.replace(/\\n/g, '\n');
        }

        if (!decodedServiceAccount.private_key.includes('BEGIN PRIVATE KEY')) {
          this.logger.warn('Firebase private key is not in PEM format. Skipping Firebase initialization.');
          return;
        }

        admin.initializeApp({
          credential: admin.credential.cert(decodedServiceAccount),
        });
        this.logger.log('Firebase Admin SDK initialized');
      } catch (error) {
        this.logger.warn('Failed to initialize Firebase Admin SDK. Push notifications will be disabled.');
      }
    } else {
      this.logger.warn('FIREBASE_SERVICE_ACCOUNT not found, FcmService will not work');
    }
  }

  async sendPushNotification(token: string, title: string, body: string, data?: any) {
    if (!admin.apps.length) {
      this.logger.warn('Firebase Admin SDK not initialized, skipping notification');
      return;
    }

    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: token,
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending message', error);
      throw error;
    }
  }

  async sendToTopic(topic: string, title: string, body: string, data?: any) {
    if (!admin.apps.length) {
      this.logger.warn('Firebase Admin SDK not initialized, skipping notification');
      return;
    }

    const message: admin.messaging.Message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      topic: topic,
    };

    try {
      const response = await admin.messaging().send(message);
      this.logger.log(`Successfully sent message to topic ${topic}: ${response}`);
      return response;
    } catch (error) {
      this.logger.error(`Error sending message to topic ${topic}`, error);
      throw error;
    }
  }
}
