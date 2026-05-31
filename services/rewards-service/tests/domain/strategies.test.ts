import { PointsStrategy, CashbackStrategy } from '../../src/domain/strategies/reward-strategy';

describe('PointsStrategy', () => {
  const strategy = new PointsStrategy();

  it('should calculate 10% of amount as points', () => {
    expect(strategy.calculate(250)).toBe(25);
    expect(strategy.calculate(100)).toBe(10);
    expect(strategy.calculate(99)).toBe(10);
  });

  it('should return POINTS type', () => {
    expect(strategy.getType()).toBe('POINTS');
  });
});

describe('CashbackStrategy', () => {
  const strategy = new CashbackStrategy();

  it('should calculate 5% of amount as cashback', () => {
    expect(strategy.calculate(200)).toBe(10);
    expect(strategy.calculate(100)).toBe(5);
    expect(strategy.calculate(99.99)).toBe(5);
  });

  it('should return CASHBACK type', () => {
    expect(strategy.getType()).toBe('CASHBACK');
  });
});
