import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTrip,
} from "../services/trips_api";

export function use_create_trip() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      createTrip,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [
            "trips",
            "today",
          ],
        }),

        queryClient.invalidateQueries({
          queryKey: [
            "trips",
            "me",
          ],
        }),
      ]);
    },
  });
}