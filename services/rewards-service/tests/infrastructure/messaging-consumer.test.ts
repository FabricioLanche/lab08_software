import { RabbitMQConsumer } from '../../src/infrastructure/messaging/rabbitmq-consumer';
import { ProcessRewardUseCase } from '../../src/application/use-cases/process-reward.use-case';
import amqplib from 'amqplib';

jest.mock('amqplib', () => ({
  connect: jest.fn(),
}));

const mockConnect = jest.mocked(amqplib.connect);

describe('RabbitMQConsumer (rewards)', () => {
  let consumer: RabbitMQConsumer;
  let useCase: jest.Mocked<ProcessRewardUseCase>;
  let mockChannel: any;

  beforeEach(() => {
    mockChannel = {
      assertExchange: jest.fn(),
      assertQueue: jest.fn().mockResolvedValue({ queue: 'dinner-registered' }),
      bindQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
      nack: jest.fn(),
      close: jest.fn(),
    };

    mockConnect.mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
    } as any);

    useCase = { execute: jest.fn().mockResolvedValue(undefined) } as any;
    consumer = new RabbitMQConsumer('amqp://localhost', useCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start and connect to RabbitMQ', async () => {
    await consumer.start();
    expect(mockConnect).toHaveBeenCalledWith('amqp://localhost');
    expect(mockChannel.assertExchange).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalled();
    expect(mockChannel.bindQueue).toHaveBeenCalled();
    expect(mockChannel.consume).toHaveBeenCalled();
  });

  it('should process messages and ack them', async () => {
    await consumer.start();

    const callback = mockChannel.consume.mock.calls[0][1];
    const msg = {
      content: Buffer.from(JSON.stringify({
        eventId: 'evt-1',
        eventType: 'DinnerRegistered',
        dinnerId: 'DINNER-001',
        cardNumber: '123',
        email: 'test@example.com',
        restaurantCode: 'REST01',
        amount: 100,
        consumedAt: new Date().toISOString(),
        occurredAt: new Date().toISOString(),
      })),
    };

    await callback(msg);

    expect(useCase.execute).toHaveBeenCalledTimes(1);
    expect(mockChannel.ack).toHaveBeenCalledWith(msg);
  });

  it('should nack messages on error', async () => {
    useCase.execute.mockRejectedValue(new Error('Processing error'));

    await consumer.start();

    const callback = mockChannel.consume.mock.calls[0][1];
    const msg = {
      content: Buffer.from(JSON.stringify({
        eventId: 'evt-2',
        eventType: 'DinnerRegistered',
        dinnerId: 'DINNER-002',
        cardNumber: '456',
        email: 'test2@example.com',
        restaurantCode: 'REST02',
        amount: 200,
        consumedAt: new Date().toISOString(),
        occurredAt: new Date().toISOString(),
      })),
    };

    await callback(msg);

    expect(mockChannel.nack).toHaveBeenCalledWith(msg, false, true);
  });

  it('should ignore null messages', async () => {
    await consumer.start();

    const callback = mockChannel.consume.mock.calls[0][1];
    await callback(null);

    expect(useCase.execute).not.toHaveBeenCalled();
  });

  it('should close without error', async () => {
    await consumer.start();
    await expect(consumer.close()).resolves.not.toThrow();
    expect(mockChannel.close).toHaveBeenCalled();
  });
});
