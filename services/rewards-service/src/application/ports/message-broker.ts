import { RewardProcessedEvent } from '@reward-system/shared';

export interface MessageBroker {
  publishRewardProcessed(event: RewardProcessedEvent): Promise<void>;
  close(): Promise<void>;
}
