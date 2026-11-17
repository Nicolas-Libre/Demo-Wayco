import type {
  ReservationForTrip,
} from "@wayco/shared/reservations";

import {
  api_get,
} from "@/lib/api";

export function get_reservation_for_trip(
  trip_id: string,
): Promise<ReservationForTrip | null> {
  return api_get<
    ReservationForTrip | null
  >(
    `/api/reservations/me/by-trip/${encodeURIComponent(
      trip_id,
    )}`,
  );
}