import {
  useQuery,
} from "@tanstack/react-query";

import type {
  TripSearchParams,
} from "@wayco/shared/trips";

import {
  searchTrips,
} from "../services/search_trips";

interface Use_search_trips_params {
  input: TripSearchParams | null;
  enabled?: boolean;
}

export function use_search_trips(
  params: Use_search_trips_params,
) {
  return useQuery({
    queryKey: [
      "trips",
      "search",
      params.input,
    ],

    queryFn: () => {
      if (!params.input) {
        throw new Error(
          "No hay parámetros suficientes para buscar viajes.",
        );
      }

      return searchTrips(
        params.input,
      );
    },

    enabled:
      (params.enabled ?? true) &&
      params.input !== null,

    retry: false,
  });
}