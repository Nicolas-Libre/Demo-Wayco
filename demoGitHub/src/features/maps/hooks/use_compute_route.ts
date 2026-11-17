import {
  useMutation,
} from "@tanstack/react-query";

import {
  computeRoute,
} from "../services/maps_api";


export function use_compute_route() {
  return useMutation({
    mutationFn:
      computeRoute,
  });
}