import { Notification } from '../../domain/entities/notification';
import { NotificationSender } from '../../application/ports/notification-sender';

export class ConsoleNotificationSender implements NotificationSender {
  async send(notification: Notification): Promise<void> {
    console.log(`[${notification.channel}] To: ${notification.cardNumber}`);
    console.log(`Subject: Reward processed for dinner ${notification.dinnerId}`);
    console.log(`Body: ${notification.message}`);
    console.log(`Sent at: ${notification.sentAt.toISOString()}`);
  }
}
