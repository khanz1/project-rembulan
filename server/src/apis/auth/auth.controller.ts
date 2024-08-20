import { RequestHandler } from 'express';
import { GoogleLoginSchema } from './auth.validation';
import { verifyGoogleToken } from '../../helpers/google';
import { BadRequestError } from '../../helpers/http.error';
import { findOrCreateUser } from './auth.service';

export const handleLoginGoogle: RequestHandler = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { googleToken } = await GoogleLoginSchema.parseAsync(req.body);

    const payload = await verifyGoogleToken(googleToken);

    if (!payload.name) {
      return next(new BadRequestError('Name is not provided'));
    }

    if (!payload.email) {
      return next(new BadRequestError('Email is not provided'));
    }

    const { created, user } = await findOrCreateUser({
      name: payload.name,
      email: payload.email,
    });
    res.status(created ? 201 : 200).json({
      accessToken: user.token,
    });
  } catch (err) {
    next(err);
  }
};
