import { DinnerController } from '../../src/infrastructure/api/controllers/dinner.controller';
import { RegisterDinnerUseCase } from '../../src/application/use-cases/register-dinner.use-case';
import { Request, Response } from 'express';

describe('DinnerController', () => {
  let controller: DinnerController;
  let useCase: jest.Mocked<RegisterDinnerUseCase>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    useCase = {
      execute: jest.fn(),
    } as any;

    controller = new DinnerController(useCase);

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    req = {
      body: {
        cardNumber: '1234567890',
        restaurantCode: 'REST001',
        amount: 250.50,
        consumedAt: '2026-05-16T20:30:00Z',
      },
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it('should return 201 on successful registration', async () => {
    useCase.execute.mockResolvedValue({ dinnerId: 'DINNER-001', status: 'RECEIVED' });

    await controller.registerDinner(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ dinnerId: 'DINNER-001', status: 'RECEIVED' });
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = {};

    await controller.registerDinner(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ error: expect.any(String) });
  });

  it('should return 400 if amount is not positive', async () => {
    req.body.amount = -10;

    await controller.registerDinner(req as Request, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
  });
});
