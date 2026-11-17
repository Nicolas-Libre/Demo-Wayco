import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteVehicle,
} from "../services/vehicles_api";

import {
  MY_VEHICLES_QUERY_KEY,
} from "./use_my_vehicles";


export function use_delete_vehicle() {
  const queryClient =
    useQueryClient();


  return useMutation({
    mutationFn: (
      vehicleId:
        string,
    ) =>
      deleteVehicle(
        vehicleId,
      ),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey:
            MY_VEHICLES_QUERY_KEY,
        }),

        /*
         * También invalidamos cualquier query
         * relacionada con viajes publicados,
         * porque el vehículo eliminado ya no
         * debe poder utilizarse.
         */
        queryClient.invalidateQueries({
          queryKey: [
            "trips",
            "me",
          ],
        }),
      ]);
    },
  });
}