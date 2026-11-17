import { saveCapturedError } from "@error/error-capture.store";

let listenersRegistered = false;

export function registerGlobalErrorCapture(): void {
  if (listenersRegistered) {
    return;
  }

  process.on("uncaughtExceptionMonitor", handleUncaughtException);
  process.on("unhandledRejection", handleUnhandledRejection);

  listenersRegistered = true;
}

function handleUncaughtException(error: Error): void {
  saveCapturedError(error);
}

function handleUnhandledRejection(reason: unknown): void {
  saveCapturedError(reason);
}