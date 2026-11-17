import type {
  UpcomingReservation,
} from "@wayco/shared/reservations";

import {
  api_get,
} from "@/lib/api";

export function get_upcoming_reservations():
  Promise<UpcomingReservation[]> {
  return api_get<
    UpcomingReservation[]
  >(
    "/api/reservations/me/upcoming",
  );
}