import { ErrorRequestHandler } from 'express';
import { HttpError, InternalServerError } from '../helpers/http.error';
import { z } from 'zod';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // logger.error(err);
  console.log(err, '<e');
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: err.errors[0].message });
  } else if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    const error = new InternalServerError();
    res.status(error.statusCode).json({ error: error.message });
  }
};
