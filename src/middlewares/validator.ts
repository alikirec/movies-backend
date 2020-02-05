import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

const validator = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = Joi.validate(req.body, schema);
  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map(i => i.message).join(',');


    res.status(422).json({ error: message })
  }
};

export default validator;
