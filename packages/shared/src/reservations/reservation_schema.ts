import { z } from "zod";

export const createReservationSchema =
  z.object({
    tripId: z
      .string()
      .uuid(
        "El identificador del viaje no es válido.",
      ),

    seats: z
      .number()
      .int()
      .min(
        1,
        "Debe reservarse al menos un asiento.",
      )
      .max(
        3,
        "No se pueden reservar más de tres asientos.",
      ),
  });

export type CreateReservationSchema =
  z.infer<
    typeof createReservationSchema
  >;