import type {
  CancelledReservation,
} from "@wayco/shared/reservations";

import {
  api_patch,
} from "@/lib/api";

export function cancel_reservation(
  reservation_id: string,
): Promise<CancelledReservation> {
  return api_patch<
    CancelledReservation,
    Record<string, never>
  >(
    `/api/reservations/${encodeURIComponent(
      reservation_id,
    )}/cancel`,
    {},
  );
}