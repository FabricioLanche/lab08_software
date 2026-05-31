import nodemailer from 'nodemailer';
import { Notification } from '../../domain/entities/notification';
import { NotificationSender } from '../../application/ports/notification-sender';
import { buildEmailHtml } from '../templates/email.template';

export class EtherealNotificationSender implements NotificationSender {
  private transporter: nodemailer.Transporter | null = null;

  async send(notification: Notification): Promise<string | undefined> {
    try {
      if (!this.transporter) {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      const html = buildEmailHtml({
        cardNumber: notification.cardNumber,
        email: notification.email,
        dinnerId: notification.dinnerId,
        rewardType: notification.rewardType,
        rewardValue: notification.rewardValue,
        message: notification.message,
      });

      const info = await this.transporter.sendMail({
        from: '"Sistema de Recompensas" <noreply@rewardsystem.test>',
        to: notification.email,
        subject: `🎉 Recompensa procesada — Cena ${notification.dinnerId}`,
        text: notification.message,
        html,
      });

      return nodemailer.getTestMessageUrl(info) as string;
    } catch (error) {
      console.error('Ethereal email failed:', (error as Error).message);
      return undefined;
    }
  }
}
