export type ApiErrorData = {
  error?: string;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  readonly status_code: number;
  readonly error_code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    status_code: number,
    error_code?: string,
    details?: unknown,
  ) {
    super(message);

    this.name = "ApiError";
    this.status_code = status_code;
    this.error_code = error_code;
    this.details = details;
  }
}