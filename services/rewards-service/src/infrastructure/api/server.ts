import express from 'express';
import { createRewardRouter } from './routes/reward.routes';
import { RewardController } from './controllers/reward.controller';
import { GetRewardsUseCase } from '../../application/use-cases/get-rewards.use-case';
import { InMemoryRewardRepository } from '../persistence/in-memory-reward.repository';
import { RabbitMQProducer } from '../messaging/rabbitmq-producer';
import { RabbitMQConsumer } from '../messaging/rabbitmq-consumer';
import { ProcessRewardUseCase } from '../../application/use-cases/process-reward.use-case';
import { PointsStrategy } from '../../domain/strategies/reward-strategy';

export async function createApp(amqpUrl?: string) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  const url = amqpUrl || process.env.AMQP_URL || 'amqp://students:Ut3c2026@213.199.42.57:5672';
  const rewardRepository = new InMemoryRewardRepository();
  const messageBroker = new RabbitMQProducer(url);
  await messageBroker.connect();

  const rewardStrategy = new PointsStrategy();
  const processRewardUseCase = new ProcessRewardUseCase(rewardRepository, rewardStrategy, messageBroker);
  const getRewardsUseCase = new GetRewardsUseCase(rewardRepository);
  const rewardController = new RewardController(getRewardsUseCase);

  const consumer = new RabbitMQConsumer(url, processRewardUseCase);
  await consumer.start();

  app.use('/api', createRewardRouter(rewardController));
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  return { app, messageBroker, consumer };
}
