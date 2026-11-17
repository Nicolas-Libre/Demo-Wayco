import { createClient } from "@supabase/supabase-js";

import type { Database } from "@wayco/shared/database";

function getServerEnvironmentVariable(name: string): string | undefined {
  if (typeof process === "undefined") {
    return undefined;
  }

  return process.env[name];
}

function createSupabaseClient() {
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ??
    getServerEnvironmentVariable("SUPABASE_URL");

  const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    getServerEnvironmentVariable("SUPABASE_PUBLISHABLE_KEY");

  const missingVariables = [
    ...(!supabaseUrl
      ? ["VITE_SUPABASE_URL o SUPABASE_URL"]
      : []),
    ...(!supabasePublishableKey
      ? ["VITE_SUPABASE_PUBLISHABLE_KEY o SUPABASE_PUBLISHABLE_KEY"]
      : []),
  ];

  if (missingVariables.length > 0) {
    const message = [
      "Faltan variables de entorno de Supabase:",
      missingVariables.join(", "),
      "Revisá el archivo .env correspondiente.",
    ].join(" ");

    console.error(`[Supabase] ${message}`);

    throw new Error(message);
  }

  return createClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      auth: {
        storage:
          typeof window !== "undefined"
            ? window.localStorage
            : undefined,
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
}

type SupabaseClient = ReturnType<typeof createSupabaseClient>;

let supabaseInstance: SupabaseClient | undefined;

function getSupabaseClient(): SupabaseClient {
  supabaseInstance ??= createSupabaseClient();

  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property, receiver) {
    return Reflect.get(
      getSupabaseClient(),
      property,
      receiver,
    );
  },
});