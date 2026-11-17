import {
  z,
} from "zod";


/* =========================================================
 * PERSON NAME
 * ======================================================= */

const PERSON_NAME_PATTERN =
  /^\p{L}+(?:[ '-]\p{L}+)*$/u;


function countLetters(
  value:
    string,
): number {
  return (
    value.match(
      /\p{L}/gu,
    )?.length ??
    0
  );
}


export function normalizePersonName(
  value:
    string,
): string {
  return value
    .trim()
    .replace(
      /\s+/g,
      " ",
    )
    .replace(
      /(^|[ '-])(\p{L})/gu,
      (
        match,
      ) =>
        match.toUpperCase(),
    );
}


export const personNameSchema =
  z
    .string()
    .trim()
    .max(
      80,
      "No puede superar los 80 caracteres.",
    )
    .transform(
      normalizePersonName,
    )
    .refine(
      (
        value,
      ) =>
        countLetters(
          value,
        ) >=
        3,
      {
        message:
          "Debe tener al menos 3 letras.",
      },
    )
    .refine(
      (
        value,
      ) =>
        PERSON_NAME_PATTERN.test(
          value,
        ),
      {
        message:
          "Solo puede contener letras, espacios, guiones o apóstrofes.",
      },
    );


/* =========================================================
 * UPDATE CURRENT USER
 * ======================================================= */

export const updateCurrentUserSchema =
  z
    .object({
      name:
        personNameSchema
          .optional(),

      surname:
        personNameSchema
          .optional(),

      phone:
        z
          .string()
          .trim()
          .min(
            8,
            "El teléfono debe tener al menos 8 caracteres.",
          )
          .max(
            30,
            "El teléfono es demasiado largo.",
          )
          .nullable()
          .optional(),

      cbuAlias:
        z
          .string()
          .trim()
          .min(
            1,
            "El CBU o alias no puede estar vacío.",
          )
          .max(
            120,
            "El CBU o alias es demasiado largo.",
          )
          .nullable()
          .optional(),
    })
    .strict()
    .refine(
      (
        value,
      ) =>
        Object.keys(
          value,
        ).length >
        0,
      {
        message:
          "Debés indicar al menos un campo para actualizar.",
      },
    );


export type UpdateCurrentUserInput =
  z.infer<
    typeof updateCurrentUserSchema
  >;


/* =========================================================
 * COMPLETE PROFILE
 * ======================================================= */

export const completeUserProfileSchema =
  z
    .object({
      name:
        personNameSchema,

      surname:
        personNameSchema,

      email:
        z
          .string()
          .trim()
          .email(
            "El email no es válido.",
          ),

      phone:
        z
          .string()
          .trim()
          .min(
            8,
            "El teléfono debe tener al menos 8 caracteres.",
          )
          .max(
            30,
            "El teléfono es demasiado largo.",
          ),
    })
    .strict();


export type CompleteUserProfileInput =
  z.infer<
    typeof completeUserProfileSchema
  >;