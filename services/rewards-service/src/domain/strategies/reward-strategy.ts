import { RewardType } from '../../domain/entities/reward';

export interface RewardStrategy {
  calculate(amount: number): number;
  getType(): RewardType;
}

export class PointsStrategy implements RewardStrategy {
  calculate(amount: number): number {
    return Math.round(amount * 0.1);
  }

  getType(): RewardType {
    return 'POINTS';
  }
}

export class CashbackStrategy implements RewardStrategy {
  calculate(amount: number): number {
    return Math.round(amount * 0.05 * 100) / 100;
  }

  getType(): RewardType {
    return 'CASHBACK';
  }
}
