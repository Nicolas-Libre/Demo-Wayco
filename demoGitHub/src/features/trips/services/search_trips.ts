import type {
  TripSearchParams,
  TripSearchResult,
} from "@wayco/shared/trips";

import {
  api_get,
} from "@/lib/api";

export function searchTrips(
  params: TripSearchParams,
): Promise<TripSearchResult[]> {
  const searchParams =
    new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      date: params.date,
    });

  return api_get<TripSearchResult[]>(
    `/api/trips/search?${searchParams.toString()}`,
  );
}