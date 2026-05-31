import { Router } from 'express';
import { DinnerController } from '../controllers/dinner.controller';

export function createDinnerRouter(dinnerController: DinnerController): Router {
  const router = Router();
  router.post('/dinners', (req, res) => dinnerController.registerDinner(req, res));
  return router;
}
