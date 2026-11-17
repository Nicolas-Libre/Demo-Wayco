import {
  z,
} from "zod";

export const admin_vehicle_reason_schema =
  z.object({
    reason:
      z
        .string()
        .trim()
        .min(
          3,
          "Debés indicar un motivo válido.",
        )
        .max(
          500,
          "El motivo no puede superar los 500 caracteres.",
        ),
  });

export type AdminVehicleReasonInput =
  z.infer<
    typeof admin_vehicle_reason_schema
  >;