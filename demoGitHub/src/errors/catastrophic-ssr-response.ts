import { consumeLastCapturedError } from "@error/error-capture";
import { renderErrorPage } from "@error/error-page";
import { createInternalServerErrorResponse } from "@error/internal-server-error.response";

const JSON_CONTENT_TYPE = "application/json";
const UNHANDLED_ERROR_MARKER = '"unhandled":true';
const HTTP_ERROR_MARKER = '"message":"HTTPError"';

export async function normalizeCatastrophicSsrResponse(
  response: Response,
): Promise<Response> {
  if (!isServerError(response)) {
    return response;
  }

  if (!isJsonResponse(response)) {
    return response;
  }

  const body = await response.clone().text();

  if (!isUnhandledH3Error(body)) {
    return response;
  }

  logOriginalError(body);

  return createInternalServerErrorResponse();
}

function isServerError(response: Response): boolean {
  return response.status >= 500;
}

function isJsonResponse(response: Response): boolean {
  const contentType =
    response.headers.get("content-type") ?? "";

  return contentType.includes(JSON_CONTENT_TYPE);
}

function isUnhandledH3Error(body: string): boolean {
  return (
    body.includes(UNHANDLED_ERROR_MARKER) &&
    body.includes(HTTP_ERROR_MARKER)
  );
}

function logOriginalError(body: string): void {
  const capturedError = consumeLastCapturedError();

  console.error(
    capturedError ??
      new Error(`h3 swallowed SSR error: ${body}`),
  );
}

