import { RewardRepository } from '../../domain/repositories/reward-repository';
import { RewardType } from '../../domain/entities/reward';
import { RewardBalanceResponse } from '@reward-system/shared';

export class GetRewardsUseCase {
  constructor(private readonly rewardRepository: RewardRepository) {}

  async execute(cardNumber: string): Promise<RewardBalanceResponse> {
    const balance = await this.rewardRepository.getBalance(cardNumber);
    return {
      cardNumber,
      rewardType: 'POINTS' as RewardType,
      balance,
    };
  }
}
