import { renderErrorPage } from "@error/error-page";

export function createInternalServerErrorResponse(): Response {
  return new Response(renderErrorPage(), {
    status: 500,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}