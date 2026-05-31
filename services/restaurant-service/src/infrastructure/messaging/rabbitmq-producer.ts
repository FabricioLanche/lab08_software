import amqp, { ChannelModel, Channel } from 'amqplib';
import { MessageBroker } from '../../application/ports/message-broker';
import {
  DinnerRegisteredEvent,
  REWARD_EXCHANGE,
  DINNER_REGISTERED_ROUTING_KEY,
} from '@reward-system/shared';

export class RabbitMQProducer implements MessageBroker {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private readonly url: string) {}

  async connect(): Promise<void> {
    const conn = await amqp.connect(this.url);
    this.connection = conn;
    this.channel = await conn.createChannel();
    await this.channel.assertExchange(REWARD_EXCHANGE, 'topic', { durable: true });
  }

  async publishDinnerRegistered(event: DinnerRegisteredEvent): Promise<void> {
    if (!this.channel) throw new Error('Not connected to RabbitMQ');
    this.channel.publish(
      REWARD_EXCHANGE,
      DINNER_REGISTERED_ROUTING_KEY,
      Buffer.from(JSON.stringify(event)),
      { persistent: true }
    );
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}
