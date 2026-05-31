export interface DinnerRegisteredEvent {
  eventId: string;
  eventType: 'DinnerRegistered';
  dinnerId: string;
  cardNumber: string;
  email: string;
  restaurantCode: string;
  amount: number;
  consumedAt: string;
  occurredAt: string;
}
