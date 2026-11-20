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
  category: "comportamiento" | "servicio_conduccion";
  score: number | null;
  isAutomatic: boolean;
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

  finalizedAt: string | null;

  // Momento estimado de llegada del viaje.
  estimatedArrivalAt: string | null;

  // Dos horas después de la llegada estimada.
  ratingDeadline: string | null;

  // Indica si ya comenzó el período de calificación.
  ratingPeriodStarted: boolean;

  // Indica si venció el período de calificación.
  ratingPeriodExpired: boolean;

  // Indica si todavía se pueden registrar calificaciones.
  ratingPeriodOpen: boolean;

  isDriver: boolean;

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

/**
 * Consulta el estado del viaje, sus participantes
 * y el período disponible para calificar.
 */
export function get_trip_completion(
  trip_id: string,
): Promise<TripCompletion> {
  return api_get<TripCompletion>(
    `/api/trips/${encodeURIComponent(trip_id)}/completion`,
  );
}

/**
 * Registra una calificación manual.
 *
 * La finalización automática del viaje se realizará
 * desde Supabase cuando todos los participantes
 * hayan calificado o cuando venza el plazo.
 */
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

/**
 * Obtiene los viajes finalizados del usuario,
 * tanto como conductor como pasajero.
 */
export function get_trip_history(): Promise<TripHistory> {
  return api_get<TripHistory>(
    "/api/trips/history",
  );
}