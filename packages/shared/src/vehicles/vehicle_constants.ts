export const VEHICLE_FUEL_TYPES = [
  "Nafta",
  "GNC",
  "Diésel",
] as const;


export const VEHICLE_VALIDATION_STATUSES = {
  PENDING:
    "pendiente",

  APPROVED:
    "aprobado",

  REJECTED:
    "rechazado",

  DISABLED:
    "dado_de_baja",

  DELETED:
    "eliminado",
} as const;


export const MAX_VEHICLE_DOCUMENT_SIZE_BYTES =
  5 * 1024 * 1024;


export const MIN_VEHICLE_YEAR =
  2000;


export const MIN_VEHICLE_CONSUMPTION_L_100_KM =
  3;


export const MAX_VEHICLE_CONSUMPTION_L_100_KM =
  25;