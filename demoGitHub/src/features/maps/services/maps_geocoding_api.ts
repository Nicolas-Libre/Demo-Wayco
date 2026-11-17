
import {
  api_post,
} from "@/lib/api";

export type Maps_coordinates = {
  lat: number;
  lng: number;
};

export type Maps_bounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type Maps_geocoding_result = {
  lat: number;
  lng: number;
  address: string;
  locality: string | null;
};

export function geocode_address_api(
  address: string,
  bounds?: Maps_bounds,
): Promise<Maps_geocoding_result> {
  return api_post<
    Maps_geocoding_result,
    {
      address: string;
      bounds?: Maps_bounds;
    }
  >(
    "/api/maps/geocode",
    {
      address,
      ...(bounds ? { bounds } : {}),
    },
  );
}

export function reverse_geocode_api(
  coordinates: Maps_coordinates,
): Promise<Maps_geocoding_result> {
  return api_post<
    Maps_geocoding_result,
    Maps_coordinates
  >(
    "/api/maps/reverse-geocode",
    coordinates,
  );
}
