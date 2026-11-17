import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_reservation_for_trip,
} from "../api/get_reservation_for_trip";

export function reservation_for_trip_query_key(
  trip_id: string,
) {
  return [
    "reservations",
    "me",
    "trip",
    trip_id,
  ] as const;
}

interface Use_reservation_for_trip_params {
  trip_id: string;
  enabled?: boolean;
}

export function use_reservation_for_trip(
  params: Use_reservation_for_trip_params,
) {
  return useQuery({
    queryKey:
      reservation_for_trip_query_key(
        params.trip_id,
      ),

    queryFn: () =>
      get_reservation_for_trip(
        params.trip_id,
      ),

    enabled:
      (params.enabled ?? true) &&
      params.trip_id.length > 0,

    retry: false,
  });
}