import amqplib from 'amqplib';
import { RabbitMQProducer } from '../../src/infrastructure/messaging/rabbitmq-producer';
import { RewardProcessedEvent } from '@reward-system/shared';

jest.mock('amqplib');

const mockChannel = {
  assertExchange: jest.fn().mockResolvedValue(undefined),
  publish: jest.fn().mockReturnValue(true),
  close: jest.fn().mockResolvedValue(undefined),
};

const mockConnect = jest.mocked(amqplib.connect);

describe('RabbitMQProducer (rewards)', () => {
  let producer: RabbitMQProducer;

  beforeEach(() => {
    producer = new RabbitMQProducer('amqp://localhost');
    mockConnect.mockResolvedValue({
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw when publishing without connection', async () => {
    const event: RewardProcessedEvent = {
      eventId: 'test-id',
      eventType: 'RewardProcessed',
      dinnerId: 'DINNER-001',
      cardNumber: '123',
      email: 'test@example.com',
      rewardType: 'POINTS',
      rewardValue: 25,
      processedAt: new Date().toISOString(),
    };

    await expect(producer.publishRewardProcessed(event)).rejects.toThrow('Not connected to RabbitMQ');
  });

  it('should close without error when not connected', async () => {
    await expect(producer.close()).resolves.not.toThrow();
  });

  it('should connect and publish reward processed event', async () => {
    await producer.connect();
    expect(mockConnect).toHaveBeenCalledWith('amqp://localhost');
    expect(mockChannel.assertExchange).toHaveBeenCalled();

    const event: RewardProcessedEvent = {
      eventId: 'test-id',
      eventType: 'RewardProcessed',
      dinnerId: 'DINNER-002',
      cardNumber: '456',
      email: 'test2@example.com',
      rewardType: 'CASHBACK',
      rewardValue: 15,
      processedAt: new Date().toISOString(),
    };

    await producer.publishRewardProcessed(event);
    expect(mockChannel.publish).toHaveBeenCalled();
  });

  it('should close connected producer', async () => {
    await producer.connect();
    await producer.close();
    expect(mockChannel.close).toHaveBeenCalled();
  });
});
