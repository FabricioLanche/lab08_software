export interface RewardProcessedEvent {
  eventId: string;
  eventType: 'RewardProcessed';
  dinnerId: string;
  cardNumber: string;
  email: string;
  rewardType: 'POINTS' | 'CASHBACK';
  rewardValue: number;
  processedAt: string;
}
