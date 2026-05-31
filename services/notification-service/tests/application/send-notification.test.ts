import { SendNotificationUseCase } from '../../src/application/use-cases/send-notification.use-case';
import { ConsoleNotificationSender } from '../../src/infrastructure/notifications/console-notification.sender';
import { NotificationSender } from '../../src/application/ports/notification-sender';
import { RewardProcessedEvent } from '@reward-system/shared';

describe('SendNotificationUseCase', () => {
  let useCase: SendNotificationUseCase;
  let sender: ConsoleNotificationSender;

  beforeEach(() => {
    sender = new ConsoleNotificationSender();
    useCase = new SendNotificationUseCase([sender]);
  });

  it('should build and send a notification from reward event', async () => {
    const event: RewardProcessedEvent = {
      eventId: 'evt-1',
      eventType: 'RewardProcessed',
      dinnerId: 'DINNER-001',
      cardNumber: '1234567890',
      email: 'test@example.com',
      rewardType: 'POINTS',
      rewardValue: 25,
      processedAt: new Date().toISOString(),
    };

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await useCase.execute(event);

    expect(consoleSpy).toHaveBeenCalled();
    const allOutput = consoleSpy.mock.calls.map(c => c[0]).join(' ');
    expect(allOutput).toContain('te generó 25');

    consoleSpy.mockRestore();
  });

  it('should log preview URL when a sender returns one', async () => {
    const mockSender: NotificationSender = {
      send: jest.fn().mockResolvedValue('https://preview.ethereal.email/test'),
    };
    const useCaseWithUrl = new SendNotificationUseCase([sender, mockSender]);
    const event: RewardProcessedEvent = {
      eventId: 'evt-2',
      eventType: 'RewardProcessed',
      dinnerId: 'DINNER-002',
      cardNumber: '999',
      email: 'test2@example.com',
      rewardType: 'CASHBACK',
      rewardValue: 10,
      processedAt: new Date().toISOString(),
    };

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await useCaseWithUrl.execute(event);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('https://preview.ethereal.email/test'));

    consoleSpy.mockRestore();
  });
});
