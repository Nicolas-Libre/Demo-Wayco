import {
  supabase,
} from "@/lib/supabase";

import {
  MAX_VEHICLE_DOCUMENT_SIZE_BYTES,
} from "@wayco/shared/vehicles";


const BUCKET =
  "documentos-conductores";


const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;


export type VehicleDocumentType =
  | "seguro"
  | "licencia"
  | "dni-frente"
  | "dni-dorso"
  | "cedula-verde";


export type DesignatedDriverDocumentType =
  | "dni-frente"
  | "dni-dorso"
  | "licencia";


function isImageDocument(
  documentType:
    VehicleDocumentType,
): boolean {
  return (
    documentType !==
    "seguro"
  );
}


function getImageExtension(
  file:
    File,
): string {
  switch (
    file.type
  ) {
    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    default:
      throw new Error(
        "El formato de imagen no es válido.",
      );
  }
}


function validateImageDocument(
  file:
    File,
): void {
  if (
    file.size >
    MAX_VEHICLE_DOCUMENT_SIZE_BYTES
  ) {
    throw new Error(
      "El archivo no puede superar los 5 MB.",
    );
  }


  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as
        (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    throw new Error(
  "El documento debe ser una imagen JPG, PNG o WebP.",
);
  }
}


async function getAuthenticatedUserId():
  Promise<string> {
  const {
    data: {
      user,
    },
    error:
      userError,
  } =
    await supabase.auth
      .getUser();


  if (
    userError ||
    !user
  ) {
    throw new Error(
      "La sesión no es válida.",
    );
  }


  return user.id;
}


async function uploadDocument(
  params: {
    path:
      string;

    file:
      File;
  },
): Promise<string> {
  const {
    error,
  } =
    await supabase.storage
      .from(
        BUCKET,
      )
      .upload(
        params.path,
        params.file,
        {
          upsert:
            true,

          contentType:
            params.file.type,
        },
      );


  if (
    error
  ) {
    console.error(
      "[Vehicle documents] Error al subir archivo:",
      {
        bucket:
          BUCKET,

        path:
          params.path,

        error,
      },
    );


    throw new Error(
      error.message ||
        "No se pudo subir el documento.",
    );
  }


  return params.path;
}


/* =========================================================
 * VEHICLE / MAIN DRIVER DOCUMENTS
 * ======================================================= */

export function validateVehicleDocument(
  file:
    File,

  documentType:
    VehicleDocumentType,
): void {
  if (
    file.size >
    MAX_VEHICLE_DOCUMENT_SIZE_BYTES
  ) {
    throw new Error(
      "El archivo no puede superar los 5 MB.",
    );
  }


  if (
    documentType ===
    "seguro"
  ) {
    if (
      file.type !==
      "application/pdf"
    ) {
      throw new Error(
  "El documento debe ser un archivo PDF.",
);
    }

    return;
  }


  validateImageDocument(
    file,
  );
}


export async function uploadVehicleDocument(
  params: {
    vehicleId:
      string;

    documentType:
      VehicleDocumentType;

    file:
      File;
  },
): Promise<string> {
  validateVehicleDocument(
    params.file,
    params.documentType,
  );


  const userId =
    await getAuthenticatedUserId();


  const isImage =
    isImageDocument(
      params.documentType,
    );


  const extension =
    isImage
      ? getImageExtension(
          params.file,
        )
      : "pdf";


  let path:
    string;


  if (
    params.documentType ===
      "dni-frente" ||
    params.documentType ===
      "dni-dorso"
  ) {
    path =
      `${userId}/identidad/${params.documentType}.${extension}`;
  } else {
    path =
      `${userId}/vehiculos/${params.vehicleId}/${params.documentType}.${extension}`;
  }


  return uploadDocument({
    path,
    file:
      params.file,
  });
}


/* =========================================================
 * DESIGNATED DRIVER DOCUMENTS
 * ======================================================= */

export function validateDesignatedDriverDocument(
  file:
    File,
): void {
  validateImageDocument(
    file,
  );
}


export async function uploadDesignatedDriverDocument(
  params: {
    vehicleId:
      string;

    designatedDriverId:
      string;

    documentType:
      DesignatedDriverDocumentType;

    file:
      File;
  },
): Promise<string> {
  validateDesignatedDriverDocument(
    params.file,
  );


  const userId =
    await getAuthenticatedUserId();


  const extension =
    getImageExtension(
      params.file,
    );


  const path =
    `${userId}/vehiculos/${params.vehicleId}/conductores-designados/${params.designatedDriverId}/${params.documentType}.${extension}`;


  return uploadDocument({
    path,
    file:
      params.file,
  });
}