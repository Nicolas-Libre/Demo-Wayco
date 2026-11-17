import type {
  CurrentUserProfile,
  UpdateCurrentUserInput,
} from "@wayco/shared/users";

import {
  api_patch,
} from "@/lib/api";


export function update_current_user(
  input: UpdateCurrentUserInput,
): Promise<CurrentUserProfile> {
  return api_patch<
    CurrentUserProfile,
    UpdateCurrentUserInput
  >(
    "/api/users/me",
    input,
  );
}