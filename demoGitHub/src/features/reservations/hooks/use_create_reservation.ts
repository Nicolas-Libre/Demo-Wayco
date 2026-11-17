import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  create_reservation,
} from "../api/create_reservation";

import {
  reservation_for_trip_query_key,
} from "./use_reservation_for_trip";

export function use_create_reservation() {
  const query_client =
    useQueryClient();

  return useMutation({
    mutationFn:
      create_reservation,

    onSuccess: async (
      _reservation,
      input,
    ) => {
      await Promise.all([
        query_client.invalidateQueries({
          queryKey:
            reservation_for_trip_query_key(
              input.tripId,
            ),
        }),

        query_client.invalidateQueries({
          queryKey: [
            "reservations",
            "me",
            "upcoming",
          ],
        }),

        query_client.invalidateQueries({
          queryKey: [
            "trips",
            "detail",
            input.tripId,
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