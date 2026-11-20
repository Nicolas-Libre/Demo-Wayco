import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
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
 * CONSTANTS
 * ======================================================= */

const ACTIVE_TRIP_REFRESH_INTERVAL_MS = 30_000;

/* =========================================================
 * CONSULTAR ESTADO Y CALIFICACIONES DEL VIAJE
 * ======================================================= */

export function use_trip_completion(
  trip_id: string | null,
) {
  return useQuery({
    queryKey: trip_completion_query_key(
      trip_id ?? "",
    ),

    queryFn: () =>
      get_trip_completion(trip_id!),

    enabled: Boolean(trip_id),

    retry: false,

    /*
     * Mientras el viaje permanezca activo,
     * consultamos periódicamente su estado.
     *
     * Esto permite detectar:
     *
     * 1. El comienzo del período de calificación.
     * 2. Las calificaciones de otros participantes.
     * 3. La finalización cuando todos califican.
     * 4. El cierre automático al vencer las 2 horas.
     *
     * Una vez finalizado o cancelado, dejamos
     * de realizar consultas periódicas.
     */
    refetchInterval: (query) => {
      const data = query.state.data;

      if (!data) {
        return false;
      }

      return data.status === "activo"
        ? ACTIVE_TRIP_REFRESH_INTERVAL_MS
        : false;
    },

    /*
     * Actualizamos la información cuando el
     * usuario vuelve a la aplicación.
     */
    refetchOnWindowFocus: true,

    /*
     * Evitamos conservar indefinidamente
     * información desactualizada.
     */
    staleTime: 0,
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
    }) =>
      rate_trip_participant(
        trip_id,
        input,
      ),

    onSuccess: async (
      result,
      variables,
    ) => {
      await Promise.all([
        /*
         * Actualizar el estado del viaje
         * y las calificaciones registradas.
         */
        query_client.invalidateQueries({
          queryKey:
            trip_completion_query_key(
              variables.trip_id,
            ),
        }),

        /*
         * Actualizar las listas de viajes.
         */
        query_client.invalidateQueries({
          queryKey: ["trips"],
        }),

        /*
         * Actualizar las reservas.
         */
        query_client.invalidateQueries({
          queryKey: ["reservations"],
        }),

        /*
         * Actualizar la reputación.
         */
        query_client.invalidateQueries({
          queryKey: [
            "users",
            "me",
            "reputation",
          ],
        }),

        /*
         * Actualizar los créditos.
         */
        query_client.invalidateQueries({
          queryKey: [
            "users",
            "me",
            "credits",
          ],
        }),
      ]);

      /*
       * Si esta calificación completó todas
       * las necesarias, Supabase habrá
       * finalizado el viaje automáticamente.
       *
       * Actualizamos también el historial.
       */
      if (
        result.status === "finalizado"
      ) {
        await query_client.invalidateQueries({
          queryKey:
            trip_history_query_key,
        });
      }
    },
  });
}

/* =========================================================
 * HISTORIAL DE VIAJES
 * ======================================================= */

export function use_trip_history() {
  return useQuery({
    queryKey:
      trip_history_query_key,

    queryFn:
      get_trip_history,

    retry: false,

    /*
     * Al ingresar al historial,
     * consultamos los datos actualizados.
     */
    refetchOnMount: "always",

    refetchOnWindowFocus: true,
  });
}