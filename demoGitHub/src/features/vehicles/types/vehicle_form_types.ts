import type {
  VehicleFuelType,
} from "@wayco/shared/vehicles";


export type VehicleFormState = {
  id:
    string;

  brand:
    string;

  model:
    string;

  year:
    number | "";

  licensePlate:
    string;

  fuelType:
    VehicleFuelType;

  consumptionL100Km:
    number | "";

  insuranceDocumentPath:
    string | null;

  insuranceDocumentName:
    string | null;

  driverLicenseDocumentPath:
    string | null;

  driverLicenseDocumentName:
    string | null;

  dniFrontDocumentPath:
    string | null;

  dniFrontDocumentName:
    string | null;

  dniBackDocumentPath:
    string | null;

  dniBackDocumentName:
    string | null;

  registrationCardDocumentPath:
    string | null;

  registrationCardDocumentName:
    string | null;
};