import { RabbitMQConsumer } from './infrastructure/messaging/rabbitmq-consumer';
import { ConsoleNotificationSender } from './infrastructure/notifications/console-notification.sender';
import { EtherealNotificationSender } from './infrastructure/notifications/ethereal-notification.sender';
import { SendNotificationUseCase } from './application/use-cases/send-notification.use-case';

const AMQP_URL = process.env.AMQP_URL || 'amqp://students:Ut3c2026@213.199.42.57:5672';

async function main() {
  const consoleSender = new ConsoleNotificationSender();
  const etherealSender = new EtherealNotificationSender();
  const sendNotificationUseCase = new SendNotificationUseCase([consoleSender, etherealSender]);
  const consumer = new RabbitMQConsumer(AMQP_URL, sendNotificationUseCase);

  await consumer.start();
  console.log('Notification service running...');

  const gracefulShutdown = async () => {
    console.log('Shutting down gracefully...');
    await consumer.close();
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

main().catch(console.error);
