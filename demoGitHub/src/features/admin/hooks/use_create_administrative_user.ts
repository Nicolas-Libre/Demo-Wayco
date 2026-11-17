import {
  useMutation,
} from "@tanstack/react-query";

import {
  create_administrative_user,
  type CreateAdministrativeUserInput,
} from "../services/admin_api";


export function use_create_administrative_user() {
  return useMutation({
    mutationFn: (
      input:
        CreateAdministrativeUserInput,
    ) =>
      create_administrative_user(
        input,
      ),
  });
}