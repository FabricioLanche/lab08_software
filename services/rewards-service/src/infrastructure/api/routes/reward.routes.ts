import { Router } from 'express';
import { RewardController } from '../controllers/reward.controller';

export function createRewardRouter(rewardController: RewardController): Router {
  const router = Router();
  router.get('/rewards/:cardNumber', (req, res) => rewardController.getRewards(req, res));
  return router;
}
