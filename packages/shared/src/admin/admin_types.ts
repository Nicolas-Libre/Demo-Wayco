import type {
  VehicleFuelType,
  VehicleValidationStatus,
} from "@wayco/shared/vehicles";


export interface AdminVehicleDriver {
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

  dniFrontUrl:
    string | null;

  dniBackUrl:
    string | null;
}


export interface AdminVehicleDesignatedDriver {
  id:
    string;

  name:
    string;

  surname:
    string;

  dni:
    string;

  dniFrontUrl:
    string;

  dniBackUrl:
    string;

  licenseUrl:
    string;

  createdAt:
    string;
}


export interface AdminVehicle {
  id:
    string;

  driverId:
    string;

  brand:
    string;

  model:
    string;

  year:
    number;

  patent:
    string;

  fuel:
    VehicleFuelType;

  fuelConsumptionX100km:
    number;

  secureUrl:
    string | null;

  licenseUrl:
    string | null;

  registrationCardUrl:
    string | null;

  validationState:
    VehicleValidationStatus;

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

  createdAt:
    string;

  driver:
    AdminVehicleDriver | null;

  designatedDrivers:
    AdminVehicleDesignatedDriver[];
}


export interface AdminVehicleReasonRequest {
  reason:
    string;
}