import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.path}`);
  next();
};
