import express from 'express';
import { createDinnerRouter } from './routes/dinner.routes';
import { DinnerController } from './controllers/dinner.controller';
import { RegisterDinnerUseCase } from '../../application/use-cases/register-dinner.use-case';
import { InMemoryDinnerRepository } from '../persistence/in-memory-dinner.repository';
import { RabbitMQProducer } from '../messaging/rabbitmq-producer';

export async function createApp(amqpUrl?: string) {
  const app = express();
  app.use(express.json());

  const dinnerRepository = new InMemoryDinnerRepository();
  const messageBroker = new RabbitMQProducer(amqpUrl || process.env.AMQP_URL || 'amqp://students:Ut3c2026@213.199.42.57:5672');
  await messageBroker.connect();

  const registerDinnerUseCase = new RegisterDinnerUseCase(dinnerRepository, messageBroker);
  const dinnerController = new DinnerController(registerDinnerUseCase);

  app.use('/api', createDinnerRouter(dinnerController));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  return { app, messageBroker };
}
