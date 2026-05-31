import { ConsoleNotificationSender } from '../../src/infrastructure/notifications/console-notification.sender';
import { Notification } from '../../src/domain/entities/notification';

describe('ConsoleNotificationSender', () => {
  it('should log notification details', async () => {
    const sender = new ConsoleNotificationSender();
    const notification = new Notification(
      'NOTIF-001',
      '1234567890',
      'DINNER-001',
      'EMAIL',
      'Test message'
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await sender.send(notification);

    expect(consoleSpy).toHaveBeenCalledTimes(4);
    expect(consoleSpy.mock.calls[0][0]).toContain('[EMAIL]');
    expect(consoleSpy.mock.calls[1][0]).toContain('DINNER-001');

    consoleSpy.mockRestore();
  });
});
