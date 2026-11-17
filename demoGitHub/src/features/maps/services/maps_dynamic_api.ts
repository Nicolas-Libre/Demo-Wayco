import {
  api_post,
} from "@/lib/api";

export type Dynamic_map_reservation = {
  allowed: boolean;
  current_count: number;
  max_count: number;
  warning_reached: boolean;
};

export async function reserve_dynamic_map_api():
  Promise<Dynamic_map_reservation> {
  return api_post<Dynamic_map_reservation>(
    "/api/maps/dynamic-map/reserve",
    {},
  );
}