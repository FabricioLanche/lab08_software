import { EtherealNotificationSender } from '../../src/infrastructure/notifications/ethereal-notification.sender';
import { Notification } from '../../src/domain/entities/notification';

jest.mock('nodemailer', () => ({
  createTestAccount: jest.fn().mockResolvedValue({
    user: 'test@ethereal.email',
    pass: 'testpass',
  }),
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: '<test@ethereal.email>',
    }),
  }),
  getTestMessageUrl: jest.fn().mockReturnValue('https://preview.ethereal.email/test'),
}));

describe('EtherealNotificationSender', () => {
  let sender: EtherealNotificationSender;
  let notification: Notification;

  beforeEach(() => {
    sender = new EtherealNotificationSender();
    notification = new Notification(
      'NOTIF-001',
      '1234567890',
      'test@example.com',
      'DINNER-001',
      'EMAIL',
      'Test reward message',
      'POINTS',
      25
    );
  });

  it('should send notification via Ethereal and return preview URL', async () => {
    const url = await sender.send(notification);

    expect(url).toBe('https://preview.ethereal.email/test');
  });

  it('should return undefined and log error when sending fails', async () => {
    const sendMail = jest.fn().mockRejectedValue(new Error('SMTP connection failed'));
    require('nodemailer').createTransport.mockReturnValue({ sendMail });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const url = await sender.send(notification);

    expect(url).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Ethereal email failed:',
      'SMTP connection failed'
    );

    consoleSpy.mockRestore();
  });
});
