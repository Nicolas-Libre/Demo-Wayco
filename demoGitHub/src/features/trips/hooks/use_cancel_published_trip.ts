import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancel_published_trip,
} from "../services/trips_api";

export function use_cancel_published_trip() {
  const query_client =
    useQueryClient();

  return useMutation({
    mutationFn:
      cancel_published_trip,

    onSuccess: async () => {
      await Promise.all([
        query_client.invalidateQueries({
          queryKey: [
            "trips",
          ],
        }),

        query_client.invalidateQueries({
          queryKey: [
            "reservations",
          ],
        }),
      ]);
    },
  });
}