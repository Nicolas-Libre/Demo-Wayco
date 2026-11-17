import {
  useMutation,
} from "@tanstack/react-query";

import {
  update_current_user,
} from "../api/update_current_user";


export function use_update_current_user() {
  return useMutation({
    mutationFn:
      update_current_user,
  });
}