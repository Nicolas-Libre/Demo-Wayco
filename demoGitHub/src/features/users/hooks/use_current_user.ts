import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_current_user,
} from "../api/get_current_user";

export function use_current_user() {
  return useQuery({
    queryKey: [
      "users",
      "me",
    ],
    queryFn: get_current_user,
    retry: false,
  });
}