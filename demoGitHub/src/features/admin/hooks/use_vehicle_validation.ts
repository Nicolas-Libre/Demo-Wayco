import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import type {
  AdminVehicle,
  AdminVehicleReasonRequest,
} from "@wayco/shared/admin";

import {
  approve_admin_vehicle,
  disable_admin_vehicle,
  reject_admin_vehicle,
} from "../services/admin_api";

import {
  admin_vehicle_query_key,
} from "./use_admin_vehicle";

import {
  ADMIN_APPROVED_VEHICLES_QUERY_KEY,
} from "./use_approved_vehicles";

import {
  ADMIN_PENDING_VEHICLES_QUERY_KEY,
} from "./use_pending_vehicles";


interface VehicleReasonVariables {
  vehicle_id:
    string;

  input:
    AdminVehicleReasonRequest;
}


function update_vehicle_cache(
  query_client:
    ReturnType<
      typeof useQueryClient
    >,

  vehicle:
    AdminVehicle,
): void {
  query_client.setQueryData(
    admin_vehicle_query_key(
      vehicle.id,
    ),
    vehicle,
  );
}


export function use_approve_vehicle() {
  const query_client =
    useQueryClient();

  return useMutation({
    mutationFn:
      approve_admin_vehicle,

    onSuccess: async (
      vehicle,
    ) => {
      update_vehicle_cache(
        query_client,
        vehicle,
      );

      await Promise.all([
        query_client.invalidateQueries({
          queryKey:
            ADMIN_PENDING_VEHICLES_QUERY_KEY,
        }),

        query_client.invalidateQueries({
          queryKey:
            ADMIN_APPROVED_VEHICLES_QUERY_KEY,
        }),
      ]);
    },
  });
}


export function use_reject_vehicle() {
  const query_client =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicle_id,
      input,
    }: VehicleReasonVariables) =>
      reject_admin_vehicle(
        vehicle_id,
        input,
      ),

    onSuccess: async (
      vehicle,
    ) => {
      update_vehicle_cache(
        query_client,
        vehicle,
      );

      await query_client.invalidateQueries({
        queryKey:
          ADMIN_PENDING_VEHICLES_QUERY_KEY,
      });
    },
  });
}


export function use_disable_vehicle() {
  const query_client =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      vehicle_id,
      input,
    }: VehicleReasonVariables) =>
      disable_admin_vehicle(
        vehicle_id,
        input,
      ),

    onSuccess: async (
      vehicle,
    ) => {
      update_vehicle_cache(
        query_client,
        vehicle,
      );

      await Promise.all([
        query_client.invalidateQueries({
          queryKey:
            ADMIN_PENDING_VEHICLES_QUERY_KEY,
        }),

        query_client.invalidateQueries({
          queryKey:
            ADMIN_APPROVED_VEHICLES_QUERY_KEY,
        }),
      ]);
    },
  });
}