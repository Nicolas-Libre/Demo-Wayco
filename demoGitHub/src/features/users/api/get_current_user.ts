import type {
  CurrentUserProfile,
} from "@wayco/shared/users";

import {
  api_get,
} from "@/lib/api";

export function get_current_user():
  Promise<CurrentUserProfile> {
  return api_get<CurrentUserProfile>(
    "/api/users/me",
  );
}