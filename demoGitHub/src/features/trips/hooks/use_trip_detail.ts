import {
  useQuery,
} from "@tanstack/react-query";

import {
  getTripById,
} from "../services/trips_api";

interface Use_trip_detail_params {
  id: string;
  enabled?: boolean;
}

export function use_trip_detail(
  params: Use_trip_detail_params,
) {
  return useQuery({
    queryKey: [
      "trips",
      "detail",
      params.id,
    ],

    queryFn: () =>
      getTripById(
        params.id,
      ),

    enabled:
      (params.enabled ?? true) &&
      params.id.length > 0,

    retry: false,
  });
}