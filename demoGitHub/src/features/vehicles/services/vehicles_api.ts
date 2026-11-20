import type {
  CreatedVehicle,
  CreateVehicleInput,
  DesignatedDriverInput,
  MyVehicle,
  VehicleDesignatedDriver,
} from "@wayco/shared/vehicles";

import {
  api_delete,
  api_get,
  api_patch,
  api_post,
} from "@/lib/api";


/* =========================================================
 * CREATE VEHICLE
 * ======================================================= */

export function createVehicle(
  input:
    CreateVehicleInput,
): Promise<CreatedVehicle> {
  return api_post<
    CreatedVehicle,
    CreateVehicleInput
  >(
    "/api/vehicles",
    input,
  );
}


/* =========================================================
 * GET MY VEHICLES
 * ======================================================= */

export function getMyVehicles():
  Promise<MyVehicle[]> {
  return api_get<
    MyVehicle[]
  >(
    "/api/vehicles/me",
  );
}


/* =========================================================
 * UPDATE VEHICLE DOCUMENTS
 * ======================================================= */

export type UpdateVehicleDocumentsInput = {
  insuranceDocumentPath:
    string;

  driverLicenseDocumentPath:
    string;

  dniFrontDocumentPath:
    string;

  dniBackDocumentPath:
    string;

  registrationCardDocumentPath:
    string;
};


export function updateVehicleDocuments(
  vehicleId:
    string,

  input:
    UpdateVehicleDocumentsInput,
): Promise<CreatedVehicle> {
  return api_patch<
    CreatedVehicle,
    UpdateVehicleDocumentsInput
  >(
    `/api/vehicles/${encodeURIComponent(
      vehicleId,
    )}/documents`,
    input,
  );
}


/* =========================================================
 * DELETE VEHICLE
 * ======================================================= */

export function deleteVehicle(
  vehicleId:
    string,
): Promise<void> {
  return api_delete<void>(
    `/api/vehicles/${encodeURIComponent(
      vehicleId,
    )}`,
  );
}


/* =========================================================
 * CREATE DESIGNATED DRIVER
 * ======================================================= */

export function createDesignatedDriver(
  vehicleId:
    string,

  input:
    DesignatedDriverInput,
): Promise<VehicleDesignatedDriver> {
  return api_post<
    VehicleDesignatedDriver,
    DesignatedDriverInput
  >(
    `/api/vehicles/${encodeURIComponent(
      vehicleId,
    )}/designated-drivers`,
    input,
  );
}


/* =========================================================
 * GET DESIGNATED DRIVERS
 * ======================================================= */

export function getDesignatedDrivers(
  vehicleId:
    string,
): Promise<VehicleDesignatedDriver[]> {
  return api_get<
    VehicleDesignatedDriver[]
  >(
    `/api/vehicles/${encodeURIComponent(
      vehicleId,
    )}/designated-drivers`,
  );
}


/* =========================================================
 * DELETE DESIGNATED DRIVER
 * ======================================================= */

export function deleteDesignatedDriver(
  vehicleId:
    string,

  designatedDriverId:
    string,
): Promise<{
  id:
    string;
}> {
  return api_delete<{
    id:
      string;
  }>(
    `/api/vehicles/${encodeURIComponent(
      vehicleId,
    )}/designated-drivers/${encodeURIComponent(
      designatedDriverId,
    )}`,
  );
}

/* =========================================================
 * VEHICLE CATALOG - AUTHENTICATED ENDPOINTS
 * ======================================================= */

export type CatalogOptions = string[];

export function getCatalogBrands(): Promise<CatalogOptions> {
  return api_get<CatalogOptions>("/api/vehicles/catalog/brands");
}

export function getCatalogModels(brand: string): Promise<CatalogOptions> {
  return api_get<CatalogOptions>(
    `/api/vehicles/catalog/models?brand=${encodeURIComponent(brand)}`,
  );
}

export function getCatalogYears(brand: string, model: string): Promise<number[]> {
  return api_get<number[]>(
    `/api/vehicles/catalog/years?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`,
  );
}

export function getCatalogVersions(
  brand: string,
  model: string,
  year: number,
): Promise<CatalogOptions> {
  return api_get<CatalogOptions>(
    `/api/vehicles/catalog/versions?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}&year=${year}`,
  );
}
