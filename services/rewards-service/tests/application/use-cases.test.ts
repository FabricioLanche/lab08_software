import { ProcessRewardUseCase } from '../../src/application/use-cases/process-reward.use-case';
import { GetRewardsUseCase } from '../../src/application/use-cases/get-rewards.use-case';
import { InMemoryRewardRepository } from '../../src/infrastructure/persistence/in-memory-reward.repository';
import { PointsStrategy } from '../../src/domain/strategies/reward-strategy';
import { MessageBroker } from '../../src/application/ports/message-broker';
import { DinnerRegisteredEvent } from '@reward-system/shared';

describe('ProcessRewardUseCase', () => {
  let useCase: ProcessRewardUseCase;
  let repository: InMemoryRewardRepository;
  let messageBroker: jest.Mocked<MessageBroker>;

  beforeEach(() => {
    repository = new InMemoryRewardRepository();
    messageBroker = {
      publishRewardProcessed: jest.fn(),
      close: jest.fn(),
    };
    useCase = new ProcessRewardUseCase(repository, new PointsStrategy(), messageBroker);
  });

  it('should process reward and publish event', async () => {
    const event: DinnerRegisteredEvent = {
      eventId: 'evt-1',
      eventType: 'DinnerRegistered',
      dinnerId: 'DINNER-001',
      cardNumber: '1234567890',
      restaurantCode: 'REST001',
      amount: 250,
      consumedAt: '2026-05-16T20:30:00Z',
      occurredAt: '2026-05-16T20:31:00Z',
    };

    await useCase.execute(event);

    const rewards = await repository.findByCardNumber('1234567890');
    expect(rewards).toHaveLength(1);
    expect(rewards[0].rewardValue).toBe(25);

    expect(messageBroker.publishRewardProcessed).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'RewardProcessed',
        dinnerId: 'DINNER-001',
        cardNumber: '1234567890',
        rewardType: 'POINTS',
        rewardValue: 25,
      })
    );
  });
});

describe('GetRewardsUseCase', () => {
  let useCase: GetRewardsUseCase;
  let repository: InMemoryRewardRepository;

  beforeEach(async () => {
    repository = new InMemoryRewardRepository();
    useCase = new GetRewardsUseCase(repository);

    const { ProcessRewardUseCase } = await import('../../src/application/use-cases/process-reward.use-case');
    const processUseCase = new ProcessRewardUseCase(repository, new PointsStrategy(), {
      publishRewardProcessed: jest.fn(),
      close: jest.fn(),
    });

    await processUseCase.execute({
      eventId: 'evt-1',
      eventType: 'DinnerRegistered',
      dinnerId: 'DINNER-001',
      cardNumber: '1234567890',
      restaurantCode: 'REST001',
      amount: 200,
      consumedAt: '2026-05-16T20:30:00Z',
      occurredAt: '2026-05-16T20:31:00Z',
    });

    await processUseCase.execute({
      eventId: 'evt-2',
      eventType: 'DinnerRegistered',
      dinnerId: 'DINNER-002',
      cardNumber: '1234567890',
      restaurantCode: 'REST001',
      amount: 300,
      consumedAt: '2026-05-17T20:30:00Z',
      occurredAt: '2026-05-17T20:31:00Z',
    });
  });

  it('should return accumulated balance for a card number', async () => {
    const result = await useCase.execute('1234567890');

    expect(result.cardNumber).toBe('1234567890');
    expect(result.balance).toBe(50); // 20 + 30
  });

  it('should return zero balance for unknown card', async () => {
    const result = await useCase.execute('0000000000');
    expect(result.balance).toBe(0);
  });
});
