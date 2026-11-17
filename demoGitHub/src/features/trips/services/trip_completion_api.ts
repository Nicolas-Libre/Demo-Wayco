import {
  api_get,
  api_post,
} from "@/lib/api";

/* =========================================================
 * TYPES
 * ======================================================= */

export type TripRatingTarget = {
  id: string;
  name: string;
  category: string;
  score: number | null;
};

export type TripCompletion = {
  tripId: string;
  status: string;

  origin: string;
  destination: string;

  date: string;
  departureTime: string;

  departurePassed: boolean;
  hasPendingReservations: boolean;

  confirmedPassengers: number;

  completedRatings: number;
  requiredRatings: number;

  targets: TripRatingTarget[];
};

export type TripRatingInput = {
  reviewedId: string;
  score: number;
};

export type TripCompletionResult = {
  tripId: string;
  status: string;
  completedRatings: number;
  requiredRatings: number;
};

export type TripHistoryItem = {
  id: string;

  origin: string;
  destination: string;

  date: string;
  departureTime: string;

  status: string;
};

export type TripHistory = {
  driver: TripHistoryItem[];
  passenger: TripHistoryItem[];
};

/* =========================================================
 * API
 * ======================================================= */

export function get_trip_completion(
  trip_id: string,
): Promise<TripCompletion> {
  return api_get<TripCompletion>(
    `/api/trips/${encodeURIComponent(trip_id)}/completion`,
  );
}

export function rate_trip_participant(
  trip_id: string,
  input: TripRatingInput,
): Promise<TripCompletionResult> {
  return api_post<
    TripCompletionResult,
    TripRatingInput
  >(
    `/api/trips/${encodeURIComponent(trip_id)}/ratings`,
    input,
  );
}

export function finalize_empty_trip(
  trip_id: string,
): Promise<TripCompletionResult> {
  return api_post<
    TripCompletionResult,
    Record<string, never>
  >(
    `/api/trips/${encodeURIComponent(trip_id)}/finalize`,
    {},
  );
}

export function get_trip_history(): Promise<TripHistory> {
  return api_get<TripHistory>(
    "/api/trips/history",
  );
}