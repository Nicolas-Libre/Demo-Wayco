import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  finalize_empty_trip,
  get_trip_completion,
  get_trip_history,
  rate_trip_participant,
  type TripRatingInput,
} from "../services/trip_completion_api";

/* =========================================================
 * QUERY KEYS
 * ======================================================= */

export const trip_completion_query_key = (
  trip_id: string,
) => ["trips", "completion", trip_id] as const;

export const trip_history_query_key = [
  "trips",
  "history",
] as const;

/* =========================================================
 * CONSULTAR FINALIZACIÓN
 * ======================================================= */

export function use_trip_completion(
  trip_id: string | null,
) {
  return useQuery({
    queryKey: trip_completion_query_key(trip_id ?? ""),
    queryFn: () => get_trip_completion(trip_id!),
    enabled: Boolean(trip_id),
    retry: false,
  });
}

/* =========================================================
 * CALIFICAR PARTICIPANTE
 * ======================================================= */

export function use_rate_trip_participant() {
  const query_client = useQueryClient();

  return useMutation({
    mutationFn: ({
      trip_id,
      input,
    }: {
      trip_id: string;
      input: TripRatingInput;
    }) => rate_trip_participant(trip_id, input),

    onSuccess: async (result, variables) => {
      await Promise.all([
        query_client.invalidateQueries({
          queryKey: trip_completion_query_key(
            variables.trip_id,
          ),
        }),

        query_client.invalidateQueries({
          queryKey: ["trips"],
        }),

        query_client.invalidateQueries({
          queryKey: ["reservations"],
        }),

        ...(result.status === "finalizado"
          ? [
              query_client.invalidateQueries({
                queryKey: ["users", "me", "reputation"],
              }),
            ]
          : []),
      ]);
    },
  });
}

/* =========================================================
 * FINALIZAR VIAJE SIN PASAJEROS
 * ======================================================= */

export function use_finalize_empty_trip() {
  const query_client = useQueryClient();

  return useMutation({
    mutationFn: (trip_id: string) =>
      finalize_empty_trip(trip_id),

    onSuccess: async (_result, trip_id) => {
      await Promise.all([
        query_client.invalidateQueries({
          queryKey: trip_completion_query_key(trip_id),
        }),

        query_client.invalidateQueries({
          queryKey: ["trips"],
        }),

        query_client.invalidateQueries({
          queryKey: ["reservations"],
        }),
      ]);
    },
  });
}

/* =========================================================
 * HISTORIAL DE VIAJES
 * ======================================================= */

export function use_trip_history() {
  return useQuery({
    queryKey: trip_history_query_key,
    queryFn: get_trip_history,
    retry: false,
  });
}