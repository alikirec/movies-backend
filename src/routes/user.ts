import { Router } from 'express';
import * as Joi from 'joi';

import UserController from '../controller/UserController';
import { checkJwt } from '../middlewares/checkJwt';
import validator from '../middlewares/validator';

const router = Router();

const moviesPostBody = Joi.object().keys({
  movies: Joi.array().items(Joi.object().keys({
    id: Joi.number().required(),
    posterPath: Joi.string().required(),
    title: Joi.string().required()
  })).required()
});

const moviesDeleteBody = Joi.array().items(Joi.number());

// Get one user
router.get(
  '/me',
  [checkJwt],
  UserController.getMe
);

router.post(
  '/me/watch-list',
  [checkJwt, validator(moviesPostBody)],
  UserController.addMovies
);

router.delete(
  '/me/watch-list',
  [checkJwt, validator(moviesDeleteBody)],
  UserController.deleteMovies
);

export default router;
