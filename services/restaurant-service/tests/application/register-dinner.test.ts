import { RegisterDinnerUseCase } from '../../src/application/use-cases/register-dinner.use-case';
import { InMemoryDinnerRepository } from '../../src/infrastructure/persistence/in-memory-dinner.repository';
import { MessageBroker } from '../../src/application/ports/message-broker';

describe('RegisterDinnerUseCase', () => {
  let useCase: RegisterDinnerUseCase;
  let repository: InMemoryDinnerRepository;
  let messageBroker: jest.Mocked<MessageBroker>;

  beforeEach(() => {
    repository = new InMemoryDinnerRepository();
    messageBroker = {
      publishDinnerRegistered: jest.fn(),
      close: jest.fn(),
    };
    useCase = new RegisterDinnerUseCase(repository, messageBroker);
  });

  it('should register a dinner and publish event', async () => {
    const result = await useCase.execute({
      cardNumber: '1234567890',
      restaurantCode: 'REST001',
      amount: 250.50,
      consumedAt: '2026-05-16T20:30:00Z',
    });

    expect(result.dinnerId).toMatch(/^DINNER-/);
    expect(result.status).toBe('RECEIVED');

    const saved = await repository.findById(result.dinnerId);
    expect(saved).not.toBeNull();
    expect(saved!.cardNumber).toBe('1234567890');

    expect(messageBroker.publishDinnerRegistered).toHaveBeenCalledTimes(1);
    expect(messageBroker.publishDinnerRegistered).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'DinnerRegistered',
        dinnerId: result.dinnerId,
        cardNumber: '1234567890',
        amount: 250.50,
      })
    );
  });
});
