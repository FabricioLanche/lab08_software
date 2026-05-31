export interface RegisterDinnerRequest {
  cardNumber: string;
  email: string;
  restaurantCode: string;
  amount: number;
  consumedAt: string;
}

export interface RegisterDinnerResponse {
  dinnerId: string;
  status: 'RECEIVED';
}

export interface RewardBalanceResponse {
  cardNumber: string;
  rewardType: 'POINTS' | 'CASHBACK';
  balance: number;
}
