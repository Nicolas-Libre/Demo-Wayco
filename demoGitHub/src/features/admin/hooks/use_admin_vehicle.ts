import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_admin_vehicle,
} from "../services/admin_api";


export function admin_vehicle_query_key(
  vehicle_id: string,
) {
  return [
    "admin",
    "vehicles",
    vehicle_id,
  ] as const;
}


export function use_admin_vehicle(
  vehicle_id: string,
) {
  return useQuery({
    queryKey:
      admin_vehicle_query_key(
        vehicle_id,
      ),

    queryFn: () =>
      get_admin_vehicle(
        vehicle_id,
      ),

    enabled:
      vehicle_id.length > 0,
  });
}