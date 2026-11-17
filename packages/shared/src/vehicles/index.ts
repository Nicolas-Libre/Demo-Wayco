export {
  MAX_VEHICLE_CONSUMPTION_L_100_KM,
  MAX_VEHICLE_DOCUMENT_SIZE_BYTES,
  MIN_VEHICLE_CONSUMPTION_L_100_KM,
  MIN_VEHICLE_YEAR,
  VEHICLE_FUEL_TYPES,
  VEHICLE_VALIDATION_STATUSES,
} from "./vehicle_constants.js";


export {
  createVehicleSchema,
  designatedDriverSchema,
  disableVehicleSchema,
  isValidLicensePlate,
  normalizeLicensePlate,
  rejectVehicleSchema,
  type CreateVehicleData,
  type CreateVehicleInput,
  type DesignatedDriverData,
  type DesignatedDriverInput,
  type DisableVehicleInput,
  type RejectVehicleInput,
} from "./vehicle_schema.js";


export type {
  AdminVehicleDetail,
  AdminVehicleDocuments,
  AdminVehicleDocumentUrl,
  AdminVehicleOwner,
  AdminVehicleSummary,
  CreatedVehicle,
  MyVehicle,
  VehicleDesignatedDriver,
  VehicleFuelType,
  VehicleValidationStatus,
} from "./vehicle_types.js";