export const ADMIN_ROLE =
  "administrativo" as const;

export const ADMIN_VEHICLE_DECISIONS =
  [
    "approve",
    "reject",
    "disable",
  ] as const;

export type AdminVehicleDecision =
  (typeof ADMIN_VEHICLE_DECISIONS)[number];