import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_my_published_trips,
} from "../services/trips_api";

export const my_published_trips_query_key = [
  "trips",
  "me",
] as const;

export function use_my_published_trips() {
  return useQuery({
    queryKey:
      my_published_trips_query_key,

    queryFn:
      get_my_published_trips,

    retry:
      false,
  });
}