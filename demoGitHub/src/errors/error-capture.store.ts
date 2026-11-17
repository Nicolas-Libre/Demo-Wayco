type CapturedError = {
  error: unknown;
  capturedAt: number;
};

const ERROR_TTL_MS = 5_000;

let lastCapturedError: CapturedError | undefined;

export function saveCapturedError(error: unknown): void {
  lastCapturedError = {
    error,
    capturedAt: Date.now(),
  };
}

export function consumeCapturedError(): unknown {
  if (!lastCapturedError) {
    return undefined;
  }

  const hasExpired =
    Date.now() - lastCapturedError.capturedAt > ERROR_TTL_MS;

  if (hasExpired) {
    lastCapturedError = undefined;
    return undefined;
  }

  const capturedError = lastCapturedError.error;

  lastCapturedError = undefined;

  return capturedError;
}