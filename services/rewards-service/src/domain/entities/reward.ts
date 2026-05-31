export type RewardType = 'POINTS' | 'CASHBACK';

export class Reward {
  constructor(
    public readonly rewardId: string,
    public readonly cardNumber: string,
    public readonly dinnerId: string,
    public readonly rewardType: RewardType,
    public readonly rewardValue: number,
    public readonly processedAt: Date = new Date()
  ) {}
}
