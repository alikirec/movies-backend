import { Router } from 'express';
import AuthController from '../controller/AuthController';
import { checkJwt } from '../middlewares/checkJwt';
import UserController from '../controller/UserController';

const router = Router();

router.post('/signup', UserController.newUser);

router.post('/login', AuthController.login);

router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
