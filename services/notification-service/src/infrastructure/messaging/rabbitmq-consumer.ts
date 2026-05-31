import amqp, { ChannelModel, Channel } from 'amqplib';
import { SendNotificationUseCase } from '../../application/use-cases/send-notification.use-case';
import {
  RewardProcessedEvent,
  REWARD_EXCHANGE,
  REWARD_PROCESSED_ROUTING_KEY,
  REWARD_PROCESSED_QUEUE,
} from '@reward-system/shared';

export class RabbitMQConsumer {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly url: string,
    private readonly sendNotificationUseCase: SendNotificationUseCase
  ) {}

  async start(): Promise<void> {
    const conn = await amqp.connect(this.url);
    this.connection = conn;
    this.channel = await conn.createChannel();

    await this.channel.assertExchange(REWARD_EXCHANGE, 'topic', { durable: true });
    await this.channel.assertQueue(REWARD_PROCESSED_QUEUE, { durable: true });
    await this.channel.bindQueue(REWARD_PROCESSED_QUEUE, REWARD_EXCHANGE, REWARD_PROCESSED_ROUTING_KEY);

    await this.channel.consume(REWARD_PROCESSED_QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const event: RewardProcessedEvent = JSON.parse(msg.content.toString());
        await this.sendNotificationUseCase.execute(event);
        this.channel!.ack(msg);
      } catch (error) {
        console.error('Error processing reward processed event:', error);
        this.channel!.nack(msg, false, true);
      }
    });

    console.log('Notification service listening for RewardProcessed events...');
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}
