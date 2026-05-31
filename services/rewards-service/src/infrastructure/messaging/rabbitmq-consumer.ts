import amqp, { ChannelModel, Channel } from 'amqplib';
import { ProcessRewardUseCase } from '../../application/use-cases/process-reward.use-case';
import {
  DinnerRegisteredEvent,
  REWARD_EXCHANGE,
  DINNER_REGISTERED_ROUTING_KEY,
  DINNER_REGISTERED_QUEUE,
} from '@reward-system/shared';

export class RabbitMQConsumer {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly url: string,
    private readonly processRewardUseCase: ProcessRewardUseCase
  ) {}

  async start(): Promise<void> {
    const conn = await amqp.connect(this.url);
    this.connection = conn;
    this.channel = await conn.createChannel();

    await this.channel.assertExchange(REWARD_EXCHANGE, 'topic', { durable: true });
    await this.channel.assertQueue(DINNER_REGISTERED_QUEUE, { durable: true });
    await this.channel.bindQueue(DINNER_REGISTERED_QUEUE, REWARD_EXCHANGE, DINNER_REGISTERED_ROUTING_KEY);

    await this.channel.consume(DINNER_REGISTERED_QUEUE, async (msg) => {
      if (!msg) return;

      try {
        const event: DinnerRegisteredEvent = JSON.parse(msg.content.toString());
        await this.processRewardUseCase.execute(event);
        this.channel!.ack(msg);
      } catch (error) {
        console.error('Error processing dinner registered event:', error);
        this.channel!.nack(msg, false, true);
      }
    });
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}
