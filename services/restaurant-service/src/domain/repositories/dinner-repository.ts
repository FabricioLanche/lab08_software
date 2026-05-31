import { Dinner } from '../entities/dinner';

export interface DinnerRepository {
  save(dinner: Dinner): Promise<void>;
  findById(dinnerId: string): Promise<Dinner | null>;
}
