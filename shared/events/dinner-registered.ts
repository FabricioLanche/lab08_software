export interface DinnerRegisteredEvent {
  eventId: string;
  eventType: 'DinnerRegistered';
  dinnerId: string;
  cardNumber: string;
  restaurantCode: string;
  amount: number;
  consumedAt: string;
  occurredAt: string;
}

export interface RewardProcessedEvent {
  eventId: string;
  eventType: 'RewardProcessed';
  dinnerId: string;
  cardNumber: string;
  rewardType: 'POINTS' | 'CASHBACK';
  rewardValue: number;
  processedAt: string;
}
