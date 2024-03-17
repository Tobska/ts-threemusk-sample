import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";
import { HttpError } from "../errors/http";

export const errorHandler = (
  err: Error,
  req: Request,
  resp: Response,
  next: NextFunction
): void => {
  if (resp.headersSent) {
    return next(err);
  }

  logger.error(err);

  if (err instanceof HttpError) {
    resp
      .status(err.statusCode)
      .json({ error: err.message, details: err.details });
  } else {
    resp.status(500).json({
      error: "Internal server error. Details available in server logs.",
    });
  }
};
