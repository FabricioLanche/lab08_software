import { Dinner } from '../../src/domain/entities/dinner';

describe('Dinner', () => {
  it('should create a dinner with given properties', () => {
    const dinner = new Dinner(
      'DINNER-001',
      '1234567890',
      'test@example.com',
      'REST001',
      250.50,
      new Date('2026-05-16T20:30:00Z')
    );

    expect(dinner.dinnerId).toBe('DINNER-001');
    expect(dinner.cardNumber).toBe('1234567890');
    expect(dinner.email).toBe('test@example.com');
    expect(dinner.restaurantCode).toBe('REST001');
    expect(dinner.amount).toBe(250.50);
    expect(dinner.consumedAt).toEqual(new Date('2026-05-16T20:30:00Z'));
    expect(dinner.registeredAt).toBeInstanceOf(Date);
  });
});
