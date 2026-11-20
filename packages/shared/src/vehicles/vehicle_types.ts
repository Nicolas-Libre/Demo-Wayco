
import type {
  VEHICLE_FUEL_TYPES,
  VEHICLE_VALIDATION_STATUSES,
} from "./vehicle_constants.js";


export type VehicleFuelType =
  (typeof VEHICLE_FUEL_TYPES)[number];


export type VehicleValidationStatus =
  (typeof VEHICLE_VALIDATION_STATUSES)[keyof typeof VEHICLE_VALIDATION_STATUSES];


/* =========================================================
 * VEHICLE CATALOG
 * ======================================================= */

export type CatalogFuelType =
  | "gasoline"
  | "diesel";


export type CatalogVehicle = {
  id: number;

  brand: string;

  model: string;

  year: number;

  version: string;

  fuelType: CatalogFuelType;

  consumptionL100Km: number;
};


/* =========================================================
 * DESIGNATED DRIVER
 * ======================================================= */

export type VehicleDesignatedDriver = {
  id:
    string;

  vehicleId:
    string;

  name:
    string;

  surname:
    string;

  dni:
    string;

  dniFrontDocumentPath:
    string;

  dniBackDocumentPath:
    string;

  driverLicenseDocumentPath:
    string;

  createdAt:
    string;
};


/* =========================================================
 * CREATED VEHICLE
 * ======================================================= */

export type CreatedVehicle = {
  id:
    string;

  brand:
    string;

  model:
    string;

  year:
    number;

  version:
    string | null;

  fuelType:
    VehicleFuelType;

  consumptionL100Km:
    number;
};


/* =========================================================
 * MY VEHICLE
 * ======================================================= */

export type MyVehicle = {
  id:
    string;

  brand:
    string;

  model:
    string;

  year:
    number;

  version:
    string | null;

  licensePlate:
    string;

  fuelType:
    VehicleFuelType;

  consumptionL100Km:
    number;

  validationState:
    VehicleValidationStatus;

  rejectReason:
    string | null;

  disableReason:
    string | null;

  validatedAt:
    string | null;

  createdAt:
    string;
};


/* =========================================================
 * ADMIN VEHICLE OWNER
 * ======================================================= */

export type AdminVehicleOwner = {
  id:
    string;

  name:
    string;

  email:
    string;
};


/* =========================================================
 * ADMIN VEHICLE SUMMARY
 * ======================================================= */

export type AdminVehicleSummary = {
  id:
    string;

  brand:
    string;

  model:
    string;

  year:
    number;

  version:
    string | null;

  licensePlate:
    string;

  validationState:
    VehicleValidationStatus;

  createdAt:
    string;

  owner:
    AdminVehicleOwner;
};


/* =========================================================
 * ADMIN VEHICLE DOCUMENTS
 * ======================================================= */

export type AdminVehicleDocuments = {
  insurancePath:
    string | null;

  driverLicensePath:
    string | null;

  registrationCardPath:
    string | null;

  dniFrontPath:
    string | null;

  dniBackPath:
    string | null;
};


/* =========================================================
 * ADMIN VEHICLE DETAIL
 * ======================================================= */

export type AdminVehicleDetail =
  AdminVehicleSummary & {
    fuelType:
      VehicleFuelType;

    consumptionL100Km:
      number;

    documents:
      AdminVehicleDocuments;

    designatedDrivers:
      VehicleDesignatedDriver[];

    validatedAt:
      string | null;

    validatedBy:
      string | null;

    rejectReason:
      string | null;

    disableReason:
      string | null;

    disabledAt:
      string | null;
  };


/* =========================================================
 * ADMIN VEHICLE DOCUMENT
 * ======================================================= */

export type AdminVehicleDocumentUrl = {
  url:
    string;
};
