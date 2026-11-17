import { demoApi } from "@/demo/services/demo_api";
import { supabase } from "@/lib/supabase";

import {
  ApiError,
  type ApiErrorData,
} from "./api_error";

const api_url = import.meta.env.VITE_API_URL;

if (!api_url && import.meta.env.VITE_DEMO_MODE !== "true") {
  throw new Error(
    "Falta la variable de entorno VITE_API_URL. Revisá el archivo .env de la raíz del proyecto.",
  );
}

type ApiRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  authenticated?: boolean;
};

function build_url(path: string): string {
  const normalized_base_url = (api_url ?? "").endsWith("/")
    ? (api_url ?? "").slice(0, -1)
    : (api_url ?? "");

  const normalized_path = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${normalized_base_url}${normalized_path}`;
}

async function get_access_token(): Promise<string | undefined> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new ApiError(
      "No se pudo obtener la sesión actual.",
      401,
      "SESSION_ERROR",
      error,
    );
  }

  return session?.access_token;
}

async function parse_response_body(
  response: Response,
): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const content_type =
    response.headers.get("content-type") ?? "";

  if (content_type.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return text.length > 0 ? text : undefined;
}

export async function api_request<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (import.meta.env.VITE_DEMO_MODE === "true") {
    return demoApi(path, options.method ?? "GET", options.body) as Promise<T>;
  }
  const {
    body,
    authenticated = true,
    headers: provided_headers,
    ...request_options
  } = options;

  const headers = new Headers(provided_headers);

  headers.set("Accept", "application/json");

  if (body !== undefined && !(body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const access_token = await get_access_token();

    if (!access_token) {
      throw new ApiError(
        "El usuario no está autenticado.",
        401,
        "UNAUTHORIZED",
      );
    }

    headers.set(
      "Authorization",
      `Bearer ${access_token}`,
    );
  }

  let response: Response;

  try {
    response = await fetch(build_url(path), {
      ...request_options,
      headers,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
  } catch (error) {
    throw new ApiError(
      "No se pudo conectar con el servidor.",
      0,
      "NETWORK_ERROR",
      error,
    );
  }

  const response_body =
    await parse_response_body(response);

  if (!response.ok) {
    const api_error =
      typeof response_body === "object" &&
      response_body !== null
        ? (response_body as ApiErrorData)
        : undefined;

    throw new ApiError(
      api_error?.message ??
        `La solicitud falló con estado ${response.status}.`,
      response.status,
      api_error?.error,
      api_error?.details ?? response_body,
    );
  }

  return response_body as T;
}

export function api_get<T>(
  path: string,
  options: Omit<
    ApiRequestOptions,
    "method" | "body"
  > = {},
): Promise<T> {
  return api_request<T>(path, {
    ...options,
    method: "GET",
  });
}

export function api_post<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options: Omit<
    ApiRequestOptions,
    "method" | "body"
  > = {},
): Promise<TResponse> {
  return api_request<TResponse>(path, {
    ...options,
    method: "POST",
    body,
  });
}

export function api_patch<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options: Omit<
    ApiRequestOptions,
    "method" | "body"
  > = {},
): Promise<TResponse> {
  return api_request<TResponse>(path, {
    ...options,
    method: "PATCH",
    body,
  });
}

export function api_put<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options: Omit<
    ApiRequestOptions,
    "method" | "body"
  > = {},
): Promise<TResponse> {
  return api_request<TResponse>(path, {
    ...options,
    method: "PUT",
    body,
  });
}

export function api_delete<T>(
  path: string,
  options: Omit<
    ApiRequestOptions,
    "method" | "body"
  > = {},
): Promise<T> {
  return api_request<T>(path, {
    ...options,
    method: "DELETE",
  });
}