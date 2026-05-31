import { Reward } from '../entities/reward';

export interface RewardRepository {
  save(reward: Reward): Promise<void>;
  findByCardNumber(cardNumber: string): Promise<Reward[]>;
  getBalance(cardNumber: string): Promise<number>;
}
