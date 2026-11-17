import type {
  TodayTrip,
} from "@wayco/shared/trips";

import {
  api_get,
} from "@/lib/api";

export function get_today_trips():
  Promise<TodayTrip[]> {
  return api_get<TodayTrip[]>(
    "/api/trips/today",
  );
}