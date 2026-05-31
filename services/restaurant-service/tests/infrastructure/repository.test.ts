import { InMemoryDinnerRepository } from '../../src/infrastructure/persistence/in-memory-dinner.repository';
import { Dinner } from '../../src/domain/entities/dinner';

describe('InMemoryDinnerRepository', () => {
  it('should save and find a dinner by id', async () => {
    const repo = new InMemoryDinnerRepository();
    const dinner = new Dinner('DINNER-001', '123', 'REST01', 100, new Date());

    await repo.save(dinner);
    const found = await repo.findById('DINNER-001');

    expect(found).toEqual(dinner);
  });

  it('should return null for non-existent dinner', async () => {
    const repo = new InMemoryDinnerRepository();
    const found = await repo.findById('NONEXISTENT');
    expect(found).toBeNull();
  });
});
