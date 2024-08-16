import { NextFunction, Request, Response } from 'express';
import { ErrorMessage, UnauthorizedError } from '../helpers/http.error';
import { verifyToken } from '../helpers/crypto';
import User from '../db/models/user.model';

export const authentication = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const bearerToken = req.header('Authorization');
  if (!bearerToken) {
    return next(new UnauthorizedError(ErrorMessage.InvalidToken));
  }

  const [type, token] = bearerToken.split(' ');
  if (type !== 'Bearer') {
    return next(new UnauthorizedError(ErrorMessage.InvalidToken));
  }

  if (!token) {
    return next(new UnauthorizedError(ErrorMessage.InvalidToken));
  }

  try {
    const data = verifyToken<{ userId: number }>(token);
    if (!data) {
      return next(new UnauthorizedError(ErrorMessage.InvalidToken));
    }

    const user = await User.findOne({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      return next(new UnauthorizedError(ErrorMessage.InvalidToken));
    }

    req.user = user;

    next();
  } catch (err) {
    next(new UnauthorizedError(ErrorMessage.InvalidToken));
  }
};
