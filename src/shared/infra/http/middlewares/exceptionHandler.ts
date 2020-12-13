import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

function exceptionHandler(
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response {
  console.error(error);

  if (error instanceof AppError) {
    return response
      .status(error.statusCode)
      .json({ status: 'error', message: error.message });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}

export default exceptionHandler;
