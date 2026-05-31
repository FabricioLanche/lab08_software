import { Notification } from '../../src/domain/entities/notification';

describe('Notification', () => {
  it('should create a notification with given properties', () => {
    const notification = new Notification(
      'NOTIF-001',
      '1234567890',
      'test@example.com',
      'DINNER-001',
      'EMAIL',
      'Your reward has been processed!',
      'POINTS',
      100
    );

    expect(notification.notificationId).toBe('NOTIF-001');
    expect(notification.cardNumber).toBe('1234567890');
    expect(notification.email).toBe('test@example.com');
    expect(notification.dinnerId).toBe('DINNER-001');
    expect(notification.channel).toBe('EMAIL');
    expect(notification.message).toBe('Your reward has been processed!');
    expect(notification.rewardType).toBe('POINTS');
    expect(notification.rewardValue).toBe(100);
    expect(notification.sentAt).toBeInstanceOf(Date);
  });
});
