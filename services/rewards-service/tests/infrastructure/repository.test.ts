import { InMemoryRewardRepository } from '../../src/infrastructure/persistence/in-memory-reward.repository';
import { Reward } from '../../src/domain/entities/reward';

describe('InMemoryRewardRepository', () => {
  it('should save and find rewards by card number', async () => {
    const repo = new InMemoryRewardRepository();
    const reward = new Reward('R-1', '123', 'D-1', 'POINTS', 10);
    await repo.save(reward);

    const found = await repo.findByCardNumber('123');
    expect(found).toHaveLength(1);
    expect(found[0].rewardId).toBe('R-1');
  });

  it('should calculate balance correctly', async () => {
    const repo = new InMemoryRewardRepository();

    await repo.save(new Reward('R-1', '123', 'D-1', 'POINTS', 10));
    await repo.save(new Reward('R-2', '123', 'D-2', 'POINTS', 20));
    await repo.save(new Reward('R-3', '456', 'D-3', 'POINTS', 15));

    const balance = await repo.getBalance('123');
    expect(balance).toBe(30);
  });

  it('should return empty array for unknown card', async () => {
    const repo = new InMemoryRewardRepository();
    const found = await repo.findByCardNumber('unknown');
    expect(found).toEqual([]);
  });
});
