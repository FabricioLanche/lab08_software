import { v4 as uuid } from 'uuid';
import { Dinner } from '../../domain/entities/dinner';
import { DinnerRepository } from '../../domain/repositories/dinner-repository';
import { MessageBroker } from '../ports/message-broker';
import { RegisterDinnerRequest, RegisterDinnerResponse, DinnerRegisteredEvent } from '@reward-system/shared';

export class RegisterDinnerUseCase {
  constructor(
    private readonly dinnerRepository: DinnerRepository,
    private readonly messageBroker: MessageBroker
  ) {}

  async execute(request: RegisterDinnerRequest): Promise<RegisterDinnerResponse> {
    const dinner = new Dinner(
      `DINNER-${uuid().slice(0, 8).toUpperCase()}`,
      request.cardNumber,
      request.restaurantCode,
      request.amount,
      new Date(request.consumedAt)
    );

    await this.dinnerRepository.save(dinner);

    const event: DinnerRegisteredEvent = {
      eventId: uuid(),
      eventType: 'DinnerRegistered',
      dinnerId: dinner.dinnerId,
      cardNumber: dinner.cardNumber,
      restaurantCode: dinner.restaurantCode,
      amount: dinner.amount,
      consumedAt: dinner.consumedAt.toISOString(),
      occurredAt: dinner.registeredAt.toISOString(),
    };

    await this.messageBroker.publishDinnerRegistered(event);

    return {
      dinnerId: dinner.dinnerId,
      status: 'RECEIVED',
    };
  }
}
