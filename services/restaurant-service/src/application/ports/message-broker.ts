import { DinnerRegisteredEvent } from '@reward-system/shared';

export interface MessageBroker {
  publishDinnerRegistered(event: DinnerRegisteredEvent): Promise<void>;
  close(): Promise<void>;
}
