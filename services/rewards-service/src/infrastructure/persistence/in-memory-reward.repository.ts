import { Reward } from '../../domain/entities/reward';
import { RewardRepository } from '../../domain/repositories/reward-repository';

export class InMemoryRewardRepository implements RewardRepository {
  private readonly rewards: Map<string, Reward> = new Map();

  async save(reward: Reward): Promise<void> {
    this.rewards.set(reward.rewardId, reward);
  }

  async findByCardNumber(cardNumber: string): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(
      (r) => r.cardNumber === cardNumber
    );
  }

  async getBalance(cardNumber: string): Promise<number> {
    return Array.from(this.rewards.values())
      .filter((r) => r.cardNumber === cardNumber)
      .reduce((sum, r) => sum + r.rewardValue, 0);
  }
}
