import { supabase } from "@/lib/supabase";

export async function getAuthenticatedUser() {
  const {
    data,
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error("No se pudo verificar la sesión.");
  }

  return data.user;
}
