import { RewardController } from '../../src/infrastructure/api/controllers/reward.controller';
import { GetRewardsUseCase } from '../../src/application/use-cases/get-rewards.use-case';
import { Request, Response } from 'express';

describe('RewardController', () => {
  let controller: RewardController;
  let useCase: jest.Mocked<GetRewardsUseCase>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    useCase = { execute: jest.fn() } as any;
    controller = new RewardController(useCase);

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = { params: { cardNumber: '1234567890' } };
    res = { status: statusMock, json: jsonMock };
  });

  it('should return rewards for a valid card number', async () => {
    useCase.execute.mockResolvedValue({
      cardNumber: '1234567890',
      rewardType: 'POINTS',
      balance: 50,
    });

    await controller.getRewards(req as Request, res as Response);

    expect(jsonMock).toHaveBeenCalledWith({
      cardNumber: '1234567890',
      rewardType: 'POINTS',
      balance: 50,
    });
  });

  it('should return 400 if cardNumber is missing', async () => {
    req.params = {};

    await controller.getRewards(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
  });

  it('should return 500 on use case error', async () => {
    useCase.execute.mockRejectedValue(new Error('Unexpected error'));

    await controller.getRewards(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
