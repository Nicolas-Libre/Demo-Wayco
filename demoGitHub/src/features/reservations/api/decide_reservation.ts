import type {
  ReservationDecisionInput,
  UpdatedReservation,
} from "@wayco/shared/reservations";

import {
  api_patch,
} from "@/lib/api";

export function decide_reservation(
  reservation_id: string,
  input: ReservationDecisionInput,
): Promise<UpdatedReservation> {
  return api_patch<
    UpdatedReservation,
    ReservationDecisionInput
  >(
    `/api/reservations/${encodeURIComponent(
      reservation_id,
    )}/decision`,
    input,
  );
}