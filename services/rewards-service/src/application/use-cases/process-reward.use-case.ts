import { v4 as uuid } from 'uuid';
import { Reward } from '../../domain/entities/reward';
import { RewardRepository } from '../../domain/repositories/reward-repository';
import { RewardStrategy } from '../../domain/strategies/reward-strategy';
import { MessageBroker } from '../ports/message-broker';
import { DinnerRegisteredEvent, RewardProcessedEvent } from '@reward-system/shared';

export class ProcessRewardUseCase {
  constructor(
    private readonly rewardRepository: RewardRepository,
    private readonly rewardStrategy: RewardStrategy,
    private readonly messageBroker: MessageBroker
  ) {}

  async execute(event: DinnerRegisteredEvent): Promise<void> {
    const rewardValue = this.rewardStrategy.calculate(event.amount);

    const reward = new Reward(
      `REWARD-${uuid().slice(0, 8).toUpperCase()}`,
      event.cardNumber,
      event.dinnerId,
      this.rewardStrategy.getType(),
      rewardValue
    );

    await this.rewardRepository.save(reward);

    const rewardEvent: RewardProcessedEvent = {
      eventId: uuid(),
      eventType: 'RewardProcessed',
      dinnerId: event.dinnerId,
      cardNumber: event.cardNumber,
      rewardType: this.rewardStrategy.getType(),
      rewardValue,
      processedAt: reward.processedAt.toISOString(),
    };

    await this.messageBroker.publishRewardProcessed(rewardEvent);
  }
}
