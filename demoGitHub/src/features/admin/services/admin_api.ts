import type {
  AdminVehicle,
  AdminVehicleReasonRequest,
} from "@wayco/shared/admin";

import {
  api_get,
  api_patch,
  api_post,
} from "@/lib/api/api_client";


/* =========================================================
 * ADMINISTRATIVE USERS
 * ======================================================= */

export interface CreateAdministrativeUserInput {
  name:
    string;

  surname:
    string;

  email:
    string;

  password:
    string;

  phone:
    string;
}


export interface AdministrativeUser {
  id:
    string;

  name:
    string;

  surname:
    string;

  email:
    string;

  phone:
    string | null;

  role:
    "administrativo";

  created_at:
    string;
}


export function create_administrative_user(
  input:
    CreateAdministrativeUserInput,
): Promise<AdministrativeUser> {
  return api_post<
    AdministrativeUser,
    CreateAdministrativeUserInput
  >(
    "/api/admin/users",
    input,
  );
}


/* =========================================================
 * VEHICLES
 * ======================================================= */

export function get_pending_admin_vehicles():
  Promise<AdminVehicle[]> {
  return api_get<AdminVehicle[]>(
    "/api/admin/vehicles/pending",
  );
}


export function get_approved_admin_vehicles():
  Promise<AdminVehicle[]> {
  return api_get<AdminVehicle[]>(
    "/api/admin/vehicles/approved",
  );
}


export function get_admin_vehicle(
  vehicle_id: string,
): Promise<AdminVehicle> {
  return api_get<AdminVehicle>(
    `/api/admin/vehicles/${vehicle_id}`,
  );
}


export function approve_admin_vehicle(
  vehicle_id: string,
): Promise<AdminVehicle> {
  return api_patch<
    AdminVehicle,
    Record<string, never>
  >(
    `/api/admin/vehicles/${vehicle_id}/approve`,
    {},
  );
}


export function reject_admin_vehicle(
  vehicle_id: string,
  input: AdminVehicleReasonRequest,
): Promise<AdminVehicle> {
  return api_patch<
    AdminVehicle,
    AdminVehicleReasonRequest
  >(
    `/api/admin/vehicles/${vehicle_id}/reject`,
    input,
  );
}


export function disable_admin_vehicle(
  vehicle_id: string,
  input: AdminVehicleReasonRequest,
): Promise<AdminVehicle> {
  return api_patch<
    AdminVehicle,
    AdminVehicleReasonRequest
  >(
    `/api/admin/vehicles/${vehicle_id}/disable`,
    input,
  );
}