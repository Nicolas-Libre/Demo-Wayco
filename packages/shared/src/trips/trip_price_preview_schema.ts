import { z } from "zod";

import {
  MAX_PASSENGER_COUNT,
  MIN_PASSENGER_COUNT,
} from "../pricing_engine/index.js";

import {
  tripLocationPointSchema,
  tripRouteSnapshotSchema,
} from "./trip_schema.js";

const iso_date_pattern =
  /^\d{4}-\d{2}-\d{2}$/;

const time_pattern =
  /^([01]\d|2[0-3]):([0-5]\d)$/;

export const tripPricePreviewSchema =
  z.object({
    origin: z
      .string()
      .trim()
      .min(
        1,
        "El origen es obligatorio.",
      )
      .max(120),

    destination: z
      .string()
      .trim()
      .min(
        1,
        "El destino es obligatorio.",
      )
      .max(120),

    date: z
      .string()
      .regex(
        iso_date_pattern,
        "La fecha debe tener formato YYYY-MM-DD.",
      ),

    departureTime: z
      .string()
      .regex(
        time_pattern,
        "La hora debe tener formato HH:mm.",
      ),

    passengerCount: z
      .number()
      .int()
      .min(MIN_PASSENGER_COUNT)
      .max(MAX_PASSENGER_COUNT),

    vehicleId: z
      .string()
      .uuid(
        "El identificador del vehículo no es válido.",
      ),
    originPoint:
      tripLocationPointSchema.optional(),

    destinationPoint:
      tripLocationPointSchema.optional(),
    route: tripRouteSnapshotSchema.optional(),
  });

export type TripPricePreviewInput =
  z.infer<
    typeof tripPricePreviewSchema
  >;