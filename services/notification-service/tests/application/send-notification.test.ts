import { SendNotificationUseCase } from '../../src/application/use-cases/send-notification.use-case';
import { ConsoleNotificationSender } from '../../src/infrastructure/notifications/console-notification.sender';
import { RewardProcessedEvent } from '@reward-system/shared';

describe('SendNotificationUseCase', () => {
  let useCase: SendNotificationUseCase;
  let sender: ConsoleNotificationSender;

  beforeEach(() => {
    sender = new ConsoleNotificationSender();
    useCase = new SendNotificationUseCase(sender);
  });

  it('should build and send a notification from reward event', async () => {
    const event: RewardProcessedEvent = {
      eventId: 'evt-1',
      eventType: 'RewardProcessed',
      dinnerId: 'DINNER-001',
      cardNumber: '1234567890',
      rewardType: 'POINTS',
      rewardValue: 25,
      processedAt: new Date().toISOString(),
    };

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await useCase.execute(event);

    expect(consoleSpy).toHaveBeenCalled();
    const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1][0];
    expect(lastCall).toContain('earned you 25 POINTS');

    consoleSpy.mockRestore();
  });
});
