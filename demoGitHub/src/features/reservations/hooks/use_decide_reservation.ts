import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  ReservationDecisionInput,
} from "@wayco/shared/reservations";

import {
  decide_reservation,
} from "../api/decide_reservation";

interface Decide_reservation_variables {
  reservation_id: string;
  input: ReservationDecisionInput;
}

export function use_decide_reservation() {
  const query_client =
    useQueryClient();

  return useMutation({
    mutationFn: (
      variables:
        Decide_reservation_variables,
    ) =>
      decide_reservation(
        variables.reservation_id,
        variables.input,
      ),

    onSuccess: async () => {
      await Promise.all([
        query_client.invalidateQueries({
          queryKey: [
            "reservations",
          ],
        }),

        query_client.invalidateQueries({
          queryKey: [
            "trips",
            "me",
          ],
        }),

        query_client.invalidateQueries({
          queryKey: [
            "trips",
            "today",
          ],
        }),

        query_client.invalidateQueries({
          queryKey: [
            "trips",
            "search",
          ],
        }),
      ]);
    },
  });
}