import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_approved_admin_vehicles,
} from "../services/admin_api";


export const ADMIN_APPROVED_VEHICLES_QUERY_KEY = [
  "admin",
  "vehicles",
  "approved",
] as const;


export function use_approved_vehicles() {
  return useQuery({
    queryKey:
      ADMIN_APPROVED_VEHICLES_QUERY_KEY,

    queryFn:
      get_approved_admin_vehicles,
  });
}