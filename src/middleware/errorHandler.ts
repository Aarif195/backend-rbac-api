import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const statusCode = error.statusCode ?? 500;

  res.status(statusCode).json({
    message: error.message,
  });
}