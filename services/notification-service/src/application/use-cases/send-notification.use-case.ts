import { v4 as uuid } from 'uuid';
import { Notification, NotificationChannel } from '../../domain/entities/notification';
import { NotificationSender } from '../ports/notification-sender';
import { RewardProcessedEvent } from '@reward-system/shared';

export class SendNotificationUseCase {
  constructor(private readonly notificationSenders: NotificationSender[]) {}

  async execute(event: RewardProcessedEvent): Promise<void> {
    const message = this.buildMessage(event);
    const notification = new Notification(
      `NOTIF-${uuid().slice(0, 8).toUpperCase()}`,
      event.cardNumber,
      event.email,
      event.dinnerId,
      'EMAIL' as NotificationChannel,
      message,
      event.rewardType,
      event.rewardValue
    );

    const urls = await Promise.all(this.notificationSenders.map(s => s.send(notification)));
    const previewUrl = urls.find(u => u !== undefined);
    if (previewUrl) console.log(`📬 Vista previa: ${previewUrl}`);
  }

  private buildMessage(event: RewardProcessedEvent): string {
    const typeLabel = event.rewardType === 'POINTS' ? 'puntos' : 'cashback';
    return `Tu cena (${event.dinnerId}) te generó ${event.rewardValue} ${typeLabel}. ¡Gracias por cenar con nosotros!`;
  }
}
