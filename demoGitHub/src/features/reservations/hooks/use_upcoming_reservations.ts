import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_upcoming_reservations,
} from "../api/get_upcoming_reservations";

export function use_upcoming_reservations() {
  return useQuery({
    queryKey: [
      "reservations",
      "me",
      "upcoming",
    ],

    queryFn:
      get_upcoming_reservations,

    retry: false,
  });
}