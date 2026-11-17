import type {
  TripRouteSnapshot,
} from "@wayco/shared/trips";

import {
  api_post,
} from "@/lib/api";


export type ComputeRoutePoint = {
  lat: number;
  lng: number;
};


export type ComputeRouteInput = {
  origin:
    ComputeRoutePoint;

  destination:
    ComputeRoutePoint;
};


export function computeRoute(
  input:
    ComputeRouteInput,
): Promise<TripRouteSnapshot> {
  return api_post<
    TripRouteSnapshot,
    ComputeRouteInput
  >(
    "/api/maps/route",
    input,
  );
}