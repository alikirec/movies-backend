import { Router } from 'express';
import * as Joi from 'joi';

import AuthController from '../controller/AuthController';
import UserController from '../controller/UserController';
import { checkJwt } from '../middlewares/checkJwt';
import validator from '../middlewares/validator';

const router = Router();

const signupRequestBody = Joi.object().keys({
  username: Joi.string().min(4).required(),
  password: Joi.string().min(6).required(),
  passwordAgain: Joi.string().required().valid(Joi.ref('password'))
});


router.post('/signup', [validator(signupRequestBody)], UserController.newUser);

router.post('/login', AuthController.login);

router.get('/logout', AuthController.logout);

router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
