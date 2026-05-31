import { Request, Response } from 'express';
import { RegisterDinnerUseCase } from '../../../application/use-cases/register-dinner.use-case';
import { RegisterDinnerRequest } from '@reward-system/shared';

export class DinnerController {
  constructor(private readonly registerDinnerUseCase: RegisterDinnerUseCase) {}

  async registerDinner(req: Request, res: Response): Promise<void> {
    try {
      const { cardNumber, email, restaurantCode, amount, consumedAt } = req.body;

      if (!cardNumber || !email || !restaurantCode || amount == null || !consumedAt) {
        res.status(400).json({ error: 'Missing required fields: cardNumber, email, restaurantCode, amount, consumedAt' });
        return;
      }

      if (typeof amount !== 'number' || amount <= 0) {
        res.status(400).json({ error: 'amount must be a positive number' });
        return;
      }

      const request: RegisterDinnerRequest = { cardNumber, email, restaurantCode, amount, consumedAt };
      const result = await this.registerDinnerUseCase.execute(request);

      res.status(201).json(result);
    } catch (error) {
      console.error('Error registering dinner:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
