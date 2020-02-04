import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

export default async (req: Request, res: Response, next: NextFunction) => {
  //Get the user ID from previous midleware
  const id = res.locals.jwtPayload.userId;
  const userId = req.params.userId;

  if (id === userId) {
    next();
  } else {
    res.status(401).send()
  }
};
