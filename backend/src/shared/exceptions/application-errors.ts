import { BaseApplicationError } from "./base-application-error";

export class DomainException extends BaseApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 400, undefined, details);
  }
}

export class ValidationException extends BaseApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 422, "VALIDATION_FAILED", details);
  }
}

export class InfrastructureException extends BaseApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 503, "INFRASTRUCTURE_ERROR", details);
  }
}

export class RepositoryException extends BaseApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 500, "DATABASE_ERROR", details);
  }
}

export class NotFoundException extends BaseApplicationError {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}
