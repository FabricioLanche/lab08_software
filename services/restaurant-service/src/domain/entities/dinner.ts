export class Dinner {
  constructor(
    public readonly dinnerId: string,
    public readonly cardNumber: string,
    public readonly email: string,
    public readonly restaurantCode: string,
    public readonly amount: number,
    public readonly consumedAt: Date,
    public readonly registeredAt: Date = new Date()
  ) {}
}
