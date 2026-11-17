import {
  z,
} from "zod";

import {
  MAX_PASSENGER_COUNT,
  MIN_PASSENGER_COUNT,
} from "../pricing_engine/index.js";


/* =========================================================
 * COMMON VALIDATION
 * ======================================================= */

const iso_date_pattern =
  /^\d{4}-\d{2}-\d{2}$/;

const time_pattern =
  /^([01]\d|2[0-3]):([0-5]\d)$/;


/* =========================================================
 * TRIP LOCATION POINT
 * ======================================================= */

export const tripLocationPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().trim().min(1).max(300),

  locality: z
    .string()
    .trim()
    .min(1, "La localidad es obligatoria.")
    .max(120, "La localidad es demasiado larga.")
    .optional(),
});

export type TripLocationPoint = z.infer<
  typeof tripLocationPointSchema
>;


/* =========================================================
 * TRIP ROUTE SNAPSHOT
 * ======================================================= */
export const signedRouteSchema =
  z.object({
    payload:
      z.object({
        userId:
          z.string().uuid(),

        origin:
          z.object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
          }),

        destination:
          z.object({
            lat: z.number().min(-90).max(90),
            lng: z.number().min(-180).max(180),
          }),

        distanceMeters:
          z.number().int().positive(),

        durationSeconds:
          z.number().int().positive(),

        polyline:
          z.string().min(1),

        tollCost:
          z.number().nonnegative().nullable(),

        expiresAt:
          z.number().int().positive(),
      }).strict(),

    signature:
      z.string().regex(/^[a-f0-9]{64}$/),
  }).strict();

export type SignedRoute =
  z.infer<typeof signedRouteSchema>;

export const tripRouteSnapshotSchema =
  z.object({
    distanceMeters:
      z.number()
        .int()
        .positive(
          "La distancia de la ruta debe ser mayor que cero.",
        ),

    durationSeconds:
      z.number()
        .int()
        .positive(
          "La duración de la ruta debe ser mayor que cero.",
        ),

    polyline:
      z.string()
        .trim()
        .min(
          1,
          "La geometría de la ruta es obligatoria.",
        ),
    tollCost:
      z.number()
        .nonnegative()
        .nullable()
        .optional(),
    
    signedRoute:
      signedRouteSchema.optional(),
  });


export type TripRouteSnapshot =
  z.infer<
    typeof tripRouteSnapshotSchema
  >;


/* =========================================================
 * CREATE TRIP
 * ======================================================= */

export const createTripSchema =
  z.object({
    origin:
      z.string()
        .trim()
        .min(
          1,
          "El origen es obligatorio.",
        )
        .max(
          120,
        ),

    destination:
      z.string()
        .trim()
        .min(
          1,
          "El destino es obligatorio.",
        )
        .max(
          120,
        ),

    originPoint:
      tripLocationPointSchema
        .optional(),

    destinationPoint:
      tripLocationPointSchema
        .optional(),

    route:
      tripRouteSnapshotSchema
        .optional(),

    date:
      z.string()
        .regex(
          iso_date_pattern,
          "La fecha debe tener formato YYYY-MM-DD.",
        ),

    departureTime:
      z.string()
        .regex(
          time_pattern,
          "La hora debe tener formato HH:mm.",
        ),

    totalSeats:
      z.number()
        .int()
        .min(
          MIN_PASSENGER_COUNT,
        )
        .max(
          MAX_PASSENGER_COUNT,
        ),

    vehicleId:
      z.string()
        .uuid(
          "El identificador del vehículo no es válido.",
        ),

    selectedPricePerSeat:
      z.number()
        .int()
        .positive(
          "El precio debe ser mayor que cero.",
        ),

    stops:
      z.array(
        z.string()
          .trim()
          .min(
            1,
          )
          .max(
            120,
          ),
      )
        .max(
          3,
          "Solo se permiten hasta tres paradas.",
        )
        .default(
          [],
        ),

    notes:
      z.string()
        .trim()
        .max(
          1000,
        )
        .nullable()
        .optional(),
  })
    .superRefine(
      (
        input,
        context,
      ) => {
        const geographicValues = [
          input.originPoint,
          input.destinationPoint,
          input.route,
        ];

        const providedCount =
          geographicValues.filter(
            (
              value,
            ) =>
              value !==
              undefined,
          ).length;

        /*
         * Durante la transición permitimos:
         *
         * 0 datos geográficos:
         * viaje del sistema anterior.
         *
         * 3 datos geográficos:
         * viaje creado con Google Maps.
         *
         * Nunca una combinación parcial.
         */
        if (
          providedCount !== 0 &&
          providedCount !== 3
        ) {
          context.addIssue({
            code:
              "custom",

            message:
              "El origen exacto, el destino exacto y la ruta deben enviarse juntos.",
          });
        }
      },
    );


export type CreateTripInput =
  z.infer<
    typeof createTripSchema
  >;