import { Notification } from '../../domain/entities/notification';

export interface NotificationSender {
  send(notification: Notification): Promise<void>;
}
