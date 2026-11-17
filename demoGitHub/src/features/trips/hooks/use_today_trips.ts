import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_today_trips,
} from "../api/get_today_trips";

export function use_today_trips() {
  return useQuery({
    queryKey: [
      "trips",
      "today",
    ],

    queryFn: get_today_trips,

    retry: false,
  });
}