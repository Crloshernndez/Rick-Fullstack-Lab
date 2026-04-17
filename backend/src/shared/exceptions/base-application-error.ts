export abstract class BaseApplicationError extends Error {
  public readonly errorCode: string;
  public readonly statusCode: number;
  public readonly details: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode?: string,
    details: Record<string, any> = {}
  ) {
    super(message);

    this.name = this.constructor.name;

    this.errorCode =
      errorCode || this.name.replace(/(?<!^)(?=[A-Z])/g, "_").toUpperCase();

    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}
