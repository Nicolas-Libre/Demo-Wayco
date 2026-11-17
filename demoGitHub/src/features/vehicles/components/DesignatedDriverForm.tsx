import {
  Contact,
  IdCard,
  Trash2,
} from "lucide-react";

import {
  VehicleDocumentUploadCard,
} from "./VehicleDocumentUploadCard";


export type DesignatedDriverFormState = {
  id:
    string;

  name:
    string;

  surname:
    string;

  dni:
    string;

  dniFrontDocumentPath:
    string | null;

  dniFrontDocumentName:
    string | null;

  dniBackDocumentPath:
    string | null;

  dniBackDocumentName:
    string | null;

  driverLicenseDocumentPath:
    string | null;

  driverLicenseDocumentName:
    string | null;
};


type Props = {
  driver:
    DesignatedDriverFormState;

  index:
    number;

  onUpdate:
    (
      driverId:
        string,

      field:
        "name" |
        "surname" |
        "dni",

      value:
        string,
    ) => void;

  onUploadDniFront:
    (
      driverId:
        string,

      file:
        File,
    ) => Promise<void>;

  onUploadDniBack:
    (
      driverId:
        string,

      file:
        File,
    ) => Promise<void>;

  onUploadLicense:
    (
      driverId:
        string,

      file:
        File,
    ) => Promise<void>;

  onClearDniFront:
    (
      driverId:
        string,
    ) => void;

  onClearDniBack:
    (
      driverId:
        string,
    ) => void;

  onClearLicense:
    (
      driverId:
        string,
    ) => void;

  onRemove:
    (
      driverId:
        string,
    ) => void;
};


export function DesignatedDriverForm({
  driver,
  index,

  onUpdate,

  onUploadDniFront,
  onUploadDniBack,
  onUploadLicense,

  onClearDniFront,
  onClearDniBack,
  onClearLicense,

  onRemove,
}: Props) {
  return (
    <div className="space-y-4 rounded-[16px] border border-[#E2E0D8] bg-[#F8F7F4] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-[#111110]">
            Conductor designado {index + 1}
          </p>

          <p className="mt-0.5 text-[12px] text-[#6B6A66]">
            Completá sus datos y documentación.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onRemove(
              driver.id,
            )
          }
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#B42318] transition hover:bg-[#FEE4E2]"
          aria-label={`Eliminar conductor designado ${index + 1}`}
          title="Eliminar conductor"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>


      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-[#4F4E4A]">
            Nombre
          </label>

          <input
            type="text"
            value={
              driver.name
            }
            onChange={(event) =>
              onUpdate(
                driver.id,
                "name",
                event.target.value,
              )
            }
            autoComplete="off"
            className="w-full rounded-[12px] border border-[#D8D6CE] bg-white px-3.5 py-3 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75]"
            placeholder="Nombre"
          />
        </div>


        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-[#4F4E4A]">
            Apellido
          </label>

          <input
            type="text"
            value={
              driver.surname
            }
            onChange={(event) =>
              onUpdate(
                driver.id,
                "surname",
                event.target.value,
              )
            }
            autoComplete="off"
            className="w-full rounded-[12px] border border-[#D8D6CE] bg-white px-3.5 py-3 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75]"
            placeholder="Apellido"
          />
        </div>


        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-[#4F4E4A]">
            DNI
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={
              driver.dni
            }
            onChange={(event) =>
              onUpdate(
                driver.id,
                "dni",
                event.target.value
                  .replace(
                    /\D/g,
                    "",
                  )
                  .slice(
                    0,
                    8,
                  ),
              )
            }
            autoComplete="off"
            className="w-full rounded-[12px] border border-[#D8D6CE] bg-white px-3.5 py-3 text-[14px] text-[#111110] outline-none transition focus:border-[#1D9E75]"
            placeholder="12345678"
          />
        </div>
      </div>


      <div className="space-y-3 pt-1">
        <VehicleDocumentUploadCard
          icon={
            <Contact className="h-6 w-6 text-[#1D9E75]" />
          }
          title="DNI - frente"
          description="Imagen JPG, PNG o WebP. Máximo 5 MB."
          format="image"
          documentPath={
            driver.dniFrontDocumentPath
          }
          documentName={
            driver.dniFrontDocumentName
          }
          onUpload={(file) =>
            onUploadDniFront(
              driver.id,
              file,
            )
          }
          onClear={() =>
            onClearDniFront(
              driver.id,
            )
          }
        />


        <VehicleDocumentUploadCard
          icon={
            <Contact className="h-6 w-6 text-[#1D9E75]" />
          }
          title="DNI - dorso"
          description="Imagen JPG, PNG o WebP. Máximo 5 MB."
          format="image"
          documentPath={
            driver.dniBackDocumentPath
          }
          documentName={
            driver.dniBackDocumentName
          }
          onUpload={(file) =>
            onUploadDniBack(
              driver.id,
              file,
            )
          }
          onClear={() =>
            onClearDniBack(
              driver.id,
            )
          }
        />


        <VehicleDocumentUploadCard
          icon={
            <IdCard className="h-6 w-6 text-[#1D9E75]" />
          }
          title="Licencia de conducir"
          description="Imagen JPG, PNG o WebP de la licencia vigente. Máximo 5 MB."
          format="image"
          documentPath={
            driver.driverLicenseDocumentPath
          }
          documentName={
            driver.driverLicenseDocumentName
          }
          onUpload={(file) =>
            onUploadLicense(
              driver.id,
              file,
            )
          }
          onClear={() =>
            onClearLicense(
              driver.id,
            )
          }
        />
      </div>
    </div>
  );
}