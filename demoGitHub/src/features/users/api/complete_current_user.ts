import type {
  CompleteUserProfileInput,
  CurrentUserProfile,
} from "@wayco/shared/users";

import {
  api_put,
} from "@/lib/api";


export function complete_current_user(
  input:
    CompleteUserProfileInput,
): Promise<CurrentUserProfile> {
  return api_put<
    CurrentUserProfile,
    CompleteUserProfileInput
  >(
    "/api/users/me/complete",
    input,
  );
}