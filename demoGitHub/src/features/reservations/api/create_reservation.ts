import type {
  CreatedReservation,
  CreateReservationInput,
} from "@wayco/shared/reservations";

import {
  api_post,
} from "@/lib/api";

export function create_reservation(
  input: CreateReservationInput,
): Promise<CreatedReservation> {
  return api_post<
    CreatedReservation,
    CreateReservationInput
  >(
    "/api/reservations",
    input,
  );
}