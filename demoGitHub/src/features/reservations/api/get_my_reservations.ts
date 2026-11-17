import type {
  MyReservation,
} from "@wayco/shared/reservations";

import {
  api_get,
} from "@/lib/api";

export function get_my_reservations():
Promise<MyReservation[]> {
  return api_get<
    MyReservation[]
  >(
    "/api/reservations/me",
  );
}