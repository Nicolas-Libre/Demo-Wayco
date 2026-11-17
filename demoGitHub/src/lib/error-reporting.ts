type ApplicationErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ApplicationEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ApplicationErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __applicationEvents?: ApplicationEvents;
  }
}

export function reportApplicationError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__applicationEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}

export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Error interno</title>
  </head>
  <body>
    <main style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: Arial, sans-serif;
      background: #f7f7f5;
      color: #111110;
    ">
      <section style="
        max-width: 520px;
        width: 100%;
        padding: 32px;
        border: 1px solid #e2e0d8;
        border-radius: 16px;
        background: white;
        text-align: center;
      ">
        <h1 style="margin: 0 0 12px; font-size: 24px;">
          Ocurrió un error inesperado
        </h1>

        <p style="margin: 0 0 24px; color: #6b6a66;">
          No pudimos cargar la aplicación. Intentá nuevamente.
        </p>

        <a
          href="/"
          style="
            display: inline-block;
            padding: 12px 18px;
            border-radius: 10px;
            background: #1d9e75;
            color: white;
            text-decoration: none;
            font-weight: 600;
          "
        >
          Volver al inicio
        </a>
      </section>
    </main>
  </body>
</html>`;
}

