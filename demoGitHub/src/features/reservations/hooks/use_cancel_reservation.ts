import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancel_reservation,
} from "../api/cancel_reservation";

import {
  reservation_for_trip_query_key,
} from "./use_reservation_for_trip";

import {
  my_reservations_query_key,
} from "./use_my_reservations";


interface Cancel_reservation_variables {
  reservation_id:
    string;

  trip_id:
    string;
}


export function use_cancel_reservation() {
  const query_client =
    useQueryClient();

  return useMutation({
    mutationFn: (
      variables:
        Cancel_reservation_variables,
    ) =>
      cancel_reservation(
        variables.reservation_id,
      ),

    onSuccess: async (
      _reservation,
      variables,
    ) => {
      /*
       * Una reserva cancelada ya no es una
       * reserva activa para ese viaje.
       *
       * La eliminamos inmediatamente del cache
       * correspondiente al detalle.
       *
       * Esto permite que el botón "Reservar asiento"
       * reaparezca sin esperar al refetch.
       */
      query_client.setQueryData(
        reservation_for_trip_query_key(
          variables.trip_id,
        ),
        null,
      );

      /*
       * Refrescamos todas las consultas afectadas:
       *
       * - historial de reservas;
       * - próximos viajes;
       * - detalle del viaje;
       * - viajes recomendados;
       * - resultados de búsqueda.
       */
      await Promise.all([
        query_client.invalidateQueries({
          queryKey:
            my_reservations_query_key,
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
            variables.trip_id,
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