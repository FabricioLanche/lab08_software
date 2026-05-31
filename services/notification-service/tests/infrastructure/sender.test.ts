import { ConsoleNotificationSender } from '../../src/infrastructure/notifications/console-notification.sender';
import { Notification } from '../../src/domain/entities/notification';

describe('ConsoleNotificationSender', () => {
  let sender: ConsoleNotificationSender;

  beforeEach(() => {
    sender = new ConsoleNotificationSender();
  });

  it('should log box with short message (no wrapping)', async () => {
    const notification = new Notification(
      'NOTIF-001', '1234567890', 'test@example.com', 'DINNER-001', 'EMAIL', 'Test message'
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await sender.send(notification);

    expect(consoleSpy).toHaveBeenCalledTimes(9);
    expect(consoleSpy.mock.calls[1][0]).toContain('NOTIFICACIÓN');
    expect(consoleSpy.mock.calls[5][0]).toContain('DINNER-001');

    consoleSpy.mockRestore();
  });

  it('should wrap long message across multiple lines', async () => {
    const notification = new Notification(
      'NOTIF-002', '999', 'user@test.com', 'DINNER-002', 'EMAIL',
      'Tu cena (DINNER-002) te generó 25 puntos. ¡Gracias por cenar con nosotros!'
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await sender.send(notification);

    const allOutput = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allOutput).toContain('Mensaje:');
    expect(allOutput).toContain('te generó');
    expect(consoleSpy.mock.calls.length).toBeGreaterThan(9);

    consoleSpy.mockRestore();
  });

  it('should handle message where wrapped rest fits in one line', async () => {
    const notification = new Notification(
      'NOTIF-003', '888', 'user2@test.com', 'DINNER-003', 'EMAIL',
      'Tu cena (DINNER-003) te generó puntos.'
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await sender.send(notification);

    const allOutput = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allOutput).toContain('puntos');
    expect(consoleSpy.mock.calls.length).toBe(10);

    consoleSpy.mockRestore();
  });

  it('should handle message with no spaces in first 35 chars', async () => {
    const notification = new Notification(
      'NOTIF-004', '777', 'user3@test.com', 'DINNER-004', 'EMAIL',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 rest'
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await sender.send(notification);

    const allOutput = consoleSpy.mock.calls.map(c => c[0]).join('\n');
    expect(allOutput).toContain('ABCDEFGHIJKLMNOPQRSTUVWXYZ01234');

    consoleSpy.mockRestore();
  });
});
