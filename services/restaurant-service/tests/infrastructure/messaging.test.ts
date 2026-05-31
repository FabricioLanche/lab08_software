import { RabbitMQProducer } from '../../src/infrastructure/messaging/rabbitmq-producer';
import { DinnerRegisteredEvent } from '@reward-system/shared';

describe('RabbitMQProducer (unit)', () => {
  let producer: RabbitMQProducer;

  beforeEach(() => {
    producer = new RabbitMQProducer('amqp://localhost');
  });

  it('should throw when publishing without connection', async () => {
    const event: DinnerRegisteredEvent = {
      eventId: 'test-id',
      eventType: 'DinnerRegistered',
      dinnerId: 'DINNER-001',
      cardNumber: '123',
      restaurantCode: 'REST01',
      amount: 100,
      consumedAt: new Date().toISOString(),
      occurredAt: new Date().toISOString(),
    };

    await expect(producer.publishDinnerRegistered(event)).rejects.toThrow('Not connected to RabbitMQ');
  });

  it('should close without error when not connected', async () => {
    await expect(producer.close()).resolves.not.toThrow();
  });
});
