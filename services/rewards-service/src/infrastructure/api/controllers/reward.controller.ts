import { Request, Response } from 'express';
import { GetRewardsUseCase } from '../../../application/use-cases/get-rewards.use-case';

export class RewardController {
  constructor(private readonly getRewardsUseCase: GetRewardsUseCase) {}

  async getRewards(req: Request, res: Response): Promise<void> {
    try {
      const { cardNumber } = req.params;

      if (!cardNumber) {
        res.status(400).json({ error: 'cardNumber is required' });
        return;
      }

      const result = await this.getRewardsUseCase.execute(cardNumber);
      res.json(result);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
