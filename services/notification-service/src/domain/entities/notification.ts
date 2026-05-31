export type NotificationChannel = 'EMAIL' | 'SMS' | 'APP';

export class Notification {
  constructor(
    public readonly notificationId: string,
    public readonly cardNumber: string,
    public readonly email: string,
    public readonly dinnerId: string,
    public readonly channel: NotificationChannel,
    public readonly message: string,
    public readonly rewardType: string = '',
    public readonly rewardValue: number = 0,
    public readonly sentAt: Date = new Date()
  ) {}
}
