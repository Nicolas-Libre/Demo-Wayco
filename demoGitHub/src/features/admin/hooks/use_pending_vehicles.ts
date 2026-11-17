import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_pending_admin_vehicles,
} from "../services/admin_api";


export const ADMIN_PENDING_VEHICLES_QUERY_KEY =
  [
    "admin",
    "vehicles",
    "pending",
  ] as const;


export function use_pending_vehicles() {
  return useQuery({
    queryKey:
      ADMIN_PENDING_VEHICLES_QUERY_KEY,

    queryFn:
      get_pending_admin_vehicles,
  });
}