import { Router } from 'express';

import UserController from '../controller/UserController';
import { checkJwt } from '../middlewares/checkJwt';
import checkOwnEntity from '../middlewares/checkOwnEntity';

const router = Router();

// Get one user
router.get(
  '/:id([0-9]+)',
  [checkJwt, checkOwnEntity],
  UserController.getOneById
);

//Edit one user
router.patch(
  '/:id([0-9]+)',
  [checkJwt, checkOwnEntity],
  UserController.editUser
);

//Delete one user
router.delete(
  '/:id([0-9]+)',
  [checkJwt, checkOwnEntity],
  UserController.deleteUser
);

export default router;
