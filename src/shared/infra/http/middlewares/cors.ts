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

  next();
}
