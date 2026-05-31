import { v4 as uuid } from 'uuid';
import { Notification, NotificationChannel } from '../../domain/entities/notification';
import { NotificationSender } from '../ports/notification-sender';
import { RewardProcessedEvent } from '@reward-system/shared';

export class SendNotificationUseCase {
  constructor(private readonly notificationSender: NotificationSender) {}

  async execute(event: RewardProcessedEvent): Promise<void> {
    const message = this.buildMessage(event);
    const notification = new Notification(
      `NOTIF-${uuid().slice(0, 8).toUpperCase()}`,
      event.cardNumber,
      event.dinnerId,
      'EMAIL' as NotificationChannel,
      message
    );

    await this.notificationSender.send(notification);
    console.log(`Notification sent to card ${event.cardNumber}: ${message}`);
  }

  private buildMessage(event: RewardProcessedEvent): string {
    return `Your dinner (${event.dinnerId}) earned you ${event.rewardValue} ${event.rewardType}. Thank you for dining with us!`;
  }
}
