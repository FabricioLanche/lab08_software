import { Reward } from '../../src/domain/entities/reward';

describe('Reward', () => {
  it('should create a reward with given properties', () => {
    const reward = new Reward(
      'REWARD-001',
      '1234567890',
      'DINNER-001',
      'POINTS',
      25
    );

    expect(reward.rewardId).toBe('REWARD-001');
    expect(reward.cardNumber).toBe('1234567890');
    expect(reward.dinnerId).toBe('DINNER-001');
    expect(reward.rewardType).toBe('POINTS');
    expect(reward.rewardValue).toBe(25);
    expect(reward.processedAt).toBeInstanceOf(Date);
  });
});
