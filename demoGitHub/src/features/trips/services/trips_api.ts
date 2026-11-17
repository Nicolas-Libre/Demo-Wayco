import type {
  CancelledTrip,
  CreatedTrip,
  CreateTripInput,
  MyPublishedTrip,
  TripDetail,
  TripPricePreview,
  TripPricePreviewInput,
} from "@wayco/shared/trips";

import {
  api_get,
  api_patch,
  api_post,
} from "@/lib/api";


export function createTrip(
  input: CreateTripInput,
): Promise<CreatedTrip> {
  return api_post<
    CreatedTrip,
    CreateTripInput
  >(
    "/api/trips",
    input,
  );
}


export function getTripPricePreview(
  input: TripPricePreviewInput,
): Promise<TripPricePreview> {
  return api_post<
    TripPricePreview,
    TripPricePreviewInput
  >(
    "/api/trips/price-preview",
    input,
  );
}


export function getTripById(
  id: string,
): Promise<TripDetail> {
  return api_get<TripDetail>(
    `/api/trips/${encodeURIComponent(
      id,
    )}`,
  );
}


export function get_my_published_trips():
Promise<MyPublishedTrip[]> {
  return api_get<
    MyPublishedTrip[]
  >(
    "/api/trips/me",
  );
}


export function cancel_published_trip(
  trip_id: string,
): Promise<CancelledTrip> {
  return api_patch<
    CancelledTrip,
    Record<string, never>
  >(
    `/api/trips/${encodeURIComponent(
      trip_id,
    )}/cancel`,
    {},
  );
}