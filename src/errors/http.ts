import { ErrorDetail } from "../common";

export abstract class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public readonly details?: ErrorDetail
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
