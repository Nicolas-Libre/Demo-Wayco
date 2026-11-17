import {
  AlertTriangle,
  CarFront,
  Contact,
  IdCard,
  Plus,
  Shield,
} from "lucide-react";

import type {
  VehicleFormState,
} from "../types/vehicle_form_types";

import {
  DesignatedDriverForm,
  type DesignatedDriverFormState,
} from "./DesignatedDriverForm";

import {
  VehicleDocumentUploadCard,
} from "./VehicleDocumentUploadCard";


type Props = {
  form:
    VehicleFormState;

  showDesignatedDrivers?:
    boolean;

  designatedDrivers:
    DesignatedDriverFormState[];

  onAddDesignatedDriver:
    () => void;

  onUpdateDesignatedDriver:
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

  onRemoveDesignatedDriver:
    (
      driverId:
        string,
    ) => void;

  onUploadDesignatedDriverDniFront:
    (
      driverId:
        string,

      file:
        File,
    ) => Promise<void>;

  onUploadDesignatedDriverDniBack:
    (
      driverId:
        string,

      file:
        File,
    ) => Promise<void>;

  onUploadDesignatedDriverLicense:
    (
      driverId:
        string,

      file:
        File,
    ) => Promise<void>;

  onClearDesignatedDriverDniFront:
    (
      driverId:
        string,
    ) => void;

  onClearDesignatedDriverDniBack:
    (
      driverId:
        string,
    ) => void;

  onClearDesignatedDriverLicense:
    (
      driverId:
        string,
    ) => void;

  onUploadInsurance:
    (file: File) => Promise<void>;

  onUploadDriverLicense:
    (file: File) => Promise<void>;

  onUploadDniFront:
    (file: File) => Promise<void>;

  onUploadDniBack:
    (file: File) => Promise<void>;

  onUploadRegistrationCard:
    (file: File) => Promise<void>;

  onClearInsurance:
    () => void;

  onClearDriverLicense:
    () => void;

  onClearDniFront:
    () => void;

  onClearDniBack:
    () => void;

  onClearRegistrationCard:
    () => void;
};


export function VehicleDocumentsStep({
  form,

  showDesignatedDrivers = true,
  designatedDrivers,

  onAddDesignatedDriver,
  onUpdateDesignatedDriver,
  onRemoveDesignatedDriver,

  onUploadDesignatedDriverDniFront,
  onUploadDesignatedDriverDniBack,
  onUploadDesignatedDriverLicense,

  onClearDesignatedDriverDniFront,
  onClearDesignatedDriverDniBack,
  onClearDesignatedDriverLicense,

  onUploadInsurance,
  onUploadDriverLicense,
  onUploadDniFront,
  onUploadDniBack,
  onUploadRegistrationCard,

  onClearInsurance,
  onClearDriverLicense,
  onClearDniFront,
  onClearDniBack,
  onClearRegistrationCard,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
        Documentación requerida
      </p>

      <div
        className="flex items-start gap-2.5 rounded-[12px] p-3.5"
        style={{
          background:
            "#FEF9C3",

          border:
            "1px solid #FDE68A",
        }}
      >
        <AlertTriangle
          className="mt-0.5 h-4 w-4 shrink-0 text-[#92400E]"
        />

        <p className="text-[13px] leading-[1.5] text-[#92400E]">
          Para verificar el vehículo necesitamos el seguro
          vigente, tu licencia de conducir, frente y dorso del
          DNI y la cédula verde.
        </p>
      </div>


      <VehicleDocumentUploadCard
        icon={
          <Shield className="h-6 w-6 text-[#1D9E75]" />
        }
        title="Seguro del vehículo"
        description="PDF de la póliza o cupón vigente. Máximo 5 MB."
        format="pdf"
        documentPath={
          form.insuranceDocumentPath
        }
        documentName={
          form.insuranceDocumentName
        }
        onUpload={
          onUploadInsurance
        }
        onClear={
          onClearInsurance
        }
      />


      <VehicleDocumentUploadCard
        icon={
          <IdCard className="h-6 w-6 text-[#1D9E75]" />
        }
        title="Licencia de conducir"
        description="Imagen JPG, PNG o WebP de tu licencia vigente. Máximo 5 MB."
        format="image"
        documentPath={
          form.driverLicenseDocumentPath
        }
        documentName={
          form.driverLicenseDocumentName
        }
        onUpload={
          onUploadDriverLicense
        }
        onClear={
          onClearDriverLicense
        }
      />


      <VehicleDocumentUploadCard
        icon={
          <Contact className="h-6 w-6 text-[#1D9E75]" />
        }
        title="DNI - frente"
        description="Imagen JPG, PNG o WebP del frente de tu DNI. Máximo 5 MB."
        format="image"
        documentPath={
          form.dniFrontDocumentPath
        }
        documentName={
          form.dniFrontDocumentName
        }
        onUpload={
          onUploadDniFront
        }
        onClear={
          onClearDniFront
        }
      />


      <VehicleDocumentUploadCard
        icon={
          <Contact className="h-6 w-6 text-[#1D9E75]" />
        }
        title="DNI - dorso"
        description="Imagen JPG, PNG o WebP del dorso de tu DNI. Máximo 5 MB."
        format="image"
        documentPath={
          form.dniBackDocumentPath
        }
        documentName={
          form.dniBackDocumentName
        }
        onUpload={
          onUploadDniBack
        }
        onClear={
          onClearDniBack
        }
      />


      <VehicleDocumentUploadCard
        icon={
          <CarFront className="h-6 w-6 text-[#1D9E75]" />
        }
        title="Cédula verde"
        description="Imagen JPG, PNG o WebP de la cédula verde del vehículo. Máximo 5 MB."
        format="image"
        documentPath={
          form.registrationCardDocumentPath
        }
        documentName={
          form.registrationCardDocumentName
        }
        onUpload={
          onUploadRegistrationCard
        }
        onClear={
          onClearRegistrationCard
        }
      />


      {showDesignatedDrivers && (
        <div className="space-y-4 pt-3">
          <div className="border-t border-[#E2E0D8] pt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
              Conductores designados (opcional)
            </p>

            <p className="mt-1.5 text-[13px] leading-[1.5] text-[#6B6A66]">
              Podés registrar otras personas autorizadas
              para conducir este vehículo.
            </p>
          </div>


          {designatedDrivers.map(
            (
              driver,
              index,
            ) => (
              <DesignatedDriverForm
                key={
                  driver.id
                }
                driver={
                  driver
                }
                index={
                  index
                }
                onUpdate={
                  onUpdateDesignatedDriver
                }
                onUploadDniFront={
                  onUploadDesignatedDriverDniFront
                }
                onUploadDniBack={
                  onUploadDesignatedDriverDniBack
                }
                onUploadLicense={
                  onUploadDesignatedDriverLicense
                }
                onClearDniFront={
                  onClearDesignatedDriverDniFront
                }
                onClearDniBack={
                  onClearDesignatedDriverDniBack
                }
                onClearLicense={
                  onClearDesignatedDriverLicense
                }
                onRemove={
                  onRemoveDesignatedDriver
                }
              />
            ),
          )}


          <button
            type="button"
            onClick={
              onAddDesignatedDriver
            }
            className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#1D9E75] px-4 py-3 text-[13px] font-semibold text-[#13795B] transition hover:bg-[#F0FAF6]"
          >
            <Plus className="h-4 w-4" />

            Agregar conductor designado
          </button>
        </div>
      )}
    </div>
  );
}