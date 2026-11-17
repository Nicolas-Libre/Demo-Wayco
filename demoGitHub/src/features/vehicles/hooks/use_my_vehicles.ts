import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMyVehicles,
} from "../services/vehicles_api";

export const MY_VEHICLES_QUERY_KEY = [
  "vehicles",
  "me",
] as const;

export function use_my_vehicles() {
  return useQuery({
    queryKey:
      MY_VEHICLES_QUERY_KEY,

    queryFn:
      getMyVehicles,

    retry: false,
  });
}