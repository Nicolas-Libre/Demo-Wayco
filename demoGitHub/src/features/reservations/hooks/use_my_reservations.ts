import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_my_reservations,
} from "../api/get_my_reservations";

export const my_reservations_query_key = [
  "reservations",
  "me",
] as const;

export function use_my_reservations() {
  return useQuery({
    queryKey:
      my_reservations_query_key,

    queryFn:
      get_my_reservations,

    retry:
      false,
  });
}