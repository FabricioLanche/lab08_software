import { Dinner } from '../../domain/entities/dinner';
import { DinnerRepository } from '../../domain/repositories/dinner-repository';

export class InMemoryDinnerRepository implements DinnerRepository {
  private readonly dinners: Map<string, Dinner> = new Map();

  async save(dinner: Dinner): Promise<void> {
    this.dinners.set(dinner.dinnerId, dinner);
  }

  async findById(dinnerId: string): Promise<Dinner | null> {
    return this.dinners.get(dinnerId) ?? null;
  }
}
