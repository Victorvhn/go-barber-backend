import { Request, Response, NextFunction } from 'express';

export default async function cors(
  _: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  response.setHeader(
    'Access-Control-Allow-Origin',
    `${process.env.APP_WEB_URL}`,
  );

  response.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );

  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type',
  );

  next();
}
