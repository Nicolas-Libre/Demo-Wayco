
import { z } from "zod";

import {
  MIN_VEHICLE_YEAR,
} from "./vehicle_constants.js";

import {
  personNameSchema,
} from "../users/user_schema.js";


const OLD_LICENSE_PLATE_PATTERN =
  /^[A-Z]{3}\s?\d{3}$/;

const NEW_LICENSE_PLATE_PATTERN =
  /^[A-Z]{2}\s?\d{3}\s?[A-Z]{2}$/;


/* =========================================================
 * TEXT NORMALIZATION
 * ======================================================= */

export function capitalizeWords(
  value: string,
): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(
      /(^|\s)(\p{L})/gu,
      (match) => match.toUpperCase(),
    );
}


/* =========================================================
 * LICENSE PLATE
 * ======================================================= */

export function normalizeLicensePlate(
  value: string,
): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}


export function isValidLicensePlate(
  value: string,
): boolean {
  const normalizedValue =
    normalizeLicensePlate(value);

  return (
    OLD_LICENSE_PLATE_PATTERN.test(
      normalizedValue,
    ) ||
    NEW_LICENSE_PLATE_PATTERN.test(
      normalizedValue,
    )
  );
}


/* =========================================================
 * DESIGNATED DRIVER
 * ======================================================= */

export const designatedDriverSchema =
  z
    .object({
      id:
        z
          .string()
          .uuid(
            "El identificador del conductor designado no es válido",
          ),

      name:
        personNameSchema,

      surname:
        personNameSchema,

      dni:
        z
          .string()
          .trim()
          .regex(
            /^\d{7,8}$/,
            "El DNI debe contener 7 u 8 números",
          ),

      dniFrontDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "El frente del DNI del conductor designado es obligatorio",
          ),

      dniBackDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "El dorso del DNI del conductor designado es obligatorio",
          ),

      driverLicenseDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "La licencia del conductor designado es obligatoria",
          ),
    })
    .strict();


export type DesignatedDriverInput =
  z.input<
    typeof designatedDriverSchema
  >;


export type DesignatedDriverData =
  z.output<
    typeof designatedDriverSchema
  >;


/* =========================================================
 * CREATE VEHICLE
 * ======================================================= */

export const createVehicleSchema =
  z
    .object({
      id:
        z
          .string()
          .uuid(
            "El identificador del vehículo no es válido",
          ),

      brand:
        z
          .string()
          .trim()
          .min(
            1,
            "La marca es obligatoria",
          )
          .max(
            80,
            "La marca es demasiado extensa",
          ),

      model:
        z
          .string()
          .trim()
          .min(
            1,
            "El modelo es obligatorio",
          )
          .max(
            80,
            "El modelo es demasiado extenso",
          ),

      year:
        z
          .number()
          .int(
            "El año debe ser un número entero",
          )
          .min(
            MIN_VEHICLE_YEAR,
            `El año debe ser igual o posterior a ${MIN_VEHICLE_YEAR}`,
          )
          .max(
            new Date().getFullYear(),
            "El año no puede ser posterior al año actual",
          ),

      version:
        z
          .string()
          .trim()
          .min(
            1,
            "La versión es obligatoria",
          )
          .max(
            160,
            "La versión es demasiado extensa",
          ),

      licensePlate:
        z
          .string()
          .transform(
            normalizeLicensePlate,
          )
          .refine(
            isValidLicensePlate,
            "La patente no es válida",
          ),

      /*
       * El combustible y el consumo NO forman parte
       * de la solicitud de creación.
       *
       * El backend debe obtener ambos valores
       * desde public.catalog.
       */

      /*
       * Seguro del vehículo.
       * Único documento que continúa siendo PDF.
       */
      insuranceDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "La ruta del seguro es obligatoria",
          ),

      /*
       * Licencia de conducir del titular.
       * Se almacena como imagen.
       */
      driverLicenseDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "La ruta de la licencia es obligatoria",
          ),

      /*
       * DNI frente del titular.
       */
      dniFrontDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "La ruta del frente del DNI es obligatoria",
          ),

      /*
       * DNI dorso del titular.
       */
      dniBackDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "La ruta del dorso del DNI es obligatoria",
          ),

      /*
       * Cédula verde del vehículo.
       */
      registrationCardDocumentPath:
        z
          .string()
          .trim()
          .min(
            1,
            "La ruta de la cédula verde es obligatoria",
          ),
    })
    .strict();


export type CreateVehicleInput =
  z.input<
    typeof createVehicleSchema
  >;


export type CreateVehicleData =
  z.output<
    typeof createVehicleSchema
  >;


/* =========================================================
 * ADMIN — REJECT VEHICLE
 * ======================================================= */

export const rejectVehicleSchema =
  z
    .object({
      reason:
        z
          .string()
          .trim()
          .min(
            1,
            "Debés indicar el motivo del rechazo.",
          )
          .max(
            500,
            "El motivo del rechazo es demasiado largo.",
          ),
    })
    .strict();


export type RejectVehicleInput =
  z.infer<
    typeof rejectVehicleSchema
  >;


/* =========================================================
 * ADMIN — DISABLE VEHICLE
 * ======================================================= */

export const disableVehicleSchema =
  z
    .object({
      reason:
        z
          .string()
          .trim()
          .min(
            1,
            "Debés indicar el motivo de la baja.",
          )
          .max(
            500,
            "El motivo de la baja es demasiado largo.",
          ),
    })
    .strict();


export type DisableVehicleInput =
  z.infer<
    typeof disableVehicleSchema
  >;
