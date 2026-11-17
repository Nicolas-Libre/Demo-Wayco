import {
  api_get,
} from "@/lib/api";


export interface CurrentUserCapabilities {
  isAdministrative:
    boolean;
}


export function get_current_user_capabilities():
  Promise<CurrentUserCapabilities> {
  return api_get<CurrentUserCapabilities>(
    "/api/users/me/capabilities",
  );
}