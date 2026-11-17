import {
  useQuery,
} from "@tanstack/react-query";

import type {
  TripPricePreviewInput,
} from "@wayco/shared/trips";

import {
  getTripPricePreview,
} from "../services/trips_api";

interface Use_trip_price_preview_params {
  input: TripPricePreviewInput | null;
}

export function use_trip_price_preview(
  params: Use_trip_price_preview_params,
) {
  return useQuery({
    queryKey: [
      "trips",
      "price-preview",
      params.input,
    ],

    queryFn: () => {
      if (!params.input) {
        throw new Error(
          "No hay información suficiente para calcular el precio.",
        );
      }

      return getTripPricePreview(
        params.input,
      );
    },

    enabled:
      params.input !== null,

    retry:
      false,

    staleTime:
      30_000,
  });
}