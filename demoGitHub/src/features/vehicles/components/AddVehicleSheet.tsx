import {
  useEffect,
} from "react";

import {
  toast,
} from "sonner";

import {
  useQueryClient,
} from "@tanstack/react-query";

import type {
  CreatedVehicle,
  MyVehicle,
} from "@wayco/shared/vehicles";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

import {
  MY_VEHICLES_QUERY_KEY,
} from "../hooks/use_my_vehicles";

import {
  useAddVehicleForm,
  type AddVehicleFormMode,
} from "../hooks/useAddVehicleForm";

import {
  VehicleStepper,
} from "./VehicleStepper";

import {
  VehicleDataStep,
} from "./VehicleDataStep";

import {
  VehicleDocumentsStep,
} from "./VehicleDocumentsStep";

import {
  VehicleReviewStep,
} from "./VehicleReviewStep";

import {
  VehicleConfirmationOverlay,
} from "./VehicleConfirmationOverlay";


/* =========================================================
 * PROPS
 * ======================================================= */

type AddVehicleSheetProps = {
  open:
    boolean;

  onClose:
    () => void;

  mode?:
    AddVehicleFormMode;

  vehicle?:
    MyVehicle | null;

  onCreated?:
    (
      vehicle:
        CreatedVehicle,
    ) => void;

  onUpdated?:
    (
      vehicle:
        CreatedVehicle,
    ) => void;
};


/* =========================================================
 * COMPONENT
 * ======================================================= */

export function AddVehicleSheet({
  open,
  onClose,
  mode = "create",
  vehicle = null,
  onCreated,
  onUpdated,
}: AddVehicleSheetProps) {
  const vehicleForm =
    useAddVehicleForm({
      mode,
      vehicle,
    });


  const queryClient =
    useQueryClient();


  const isUpdatingDocuments =
    mode ===
    "update_documents";


  /* =======================================================
   * RESET AFTER FULL CLOSE
   * ===================================================== */

  useEffect(() => {
    if (
      open ||
      vehicleForm.confirmationVisible
    ) {
      return;
    }


    const timeout =
      window.setTimeout(
        () => {
          vehicleForm.reset();
        },
        200,
      );


    return () =>
      window.clearTimeout(
        timeout,
      );
  }, [
    open,
    vehicleForm.confirmationVisible,
    vehicleForm.reset,
  ]);


  /* =======================================================
   * SUBMIT
   * ===================================================== */

  async function handleSubmit() {
    try {
      const result =
        await vehicleForm
          .submit();


      /*
       * Refrescamos la consulta para reflejar
       * inmediatamente:
       *
       * create:
       * nuevo vehículo pendiente.
       *
       * update_documents:
       * vehículo rechazado / dado de baja -> pendiente.
       */
      await queryClient
        .invalidateQueries({
          queryKey:
            MY_VEHICLES_QUERY_KEY,
        });


      if (
        isUpdatingDocuments
      ) {
        onUpdated?.(
          result,
        );
      } else {
        onCreated?.(
          result,
        );
      }
    } catch (
      error
    ) {
      toast.error(
        error instanceof Error
          ? error.message
          : isUpdatingDocuments
            ? "No se pudieron actualizar los documentos."
            : "No se pudo enviar la solicitud.",
      );
    }
  }


  /* =======================================================
   * CONFIRMATION CLOSE
   * ===================================================== */

  function closeConfirmation() {
    vehicleForm
      .setConfirmationVisible(
        false,
      );


    onClose();
  }


  /* =======================================================
   * CLOSE DOCUMENT STEP
   * ===================================================== */

  function handleDocumentsBack() {
    /*
     * Cuando estamos registrando un vehículo
     * volvemos al paso 1.
     *
     * Cuando estamos actualizando documentos,
     * el paso 1 no forma parte del flujo.
     */
    if (
      isUpdatingDocuments
    ) {
      onClose();

      return;
    }


    vehicleForm.setStep(
      1,
    );
  }


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <>
      <BottomSheet
        open={
          open &&
          !vehicleForm.confirmationVisible
        }
        onClose={
          onClose
        }
        tall
      >
        {/* =================================================
         * HEADER
         * =============================================== */}

        <div>
          <h2 className="text-[20px] font-bold text-[#111110]">
            {isUpdatingDocuments
              ? "Actualizar documentación"
              : "Registrá tu vehículo"}
          </h2>


          <p className="mt-1 text-[13px] leading-[1.5] text-[#6B6A66]">
            {isUpdatingDocuments
              ? "Cargá nuevamente la documentación requerida. El equipo de Wayco la revisará antes de volver a habilitar el vehículo."
              : "Tu información será revisada por el equipo de Wayco antes de activar tu perfil como conductor."}
          </p>


          {isUpdatingDocuments &&
            vehicle && (
              <div className="mt-4 rounded-[12px] border border-[#E2E0D8] bg-[#F8F7F4] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A8984]">
                  Vehículo
                </p>

                <p className="mt-1 text-[14px] font-semibold text-[#111110]">
                  {vehicle.brand}{" "}
                  {vehicle.model}{" "}
                  {vehicle.year}
                  {vehicle.version ? ` · ${vehicle.version}` : ""}
                </p>

                <p className="mt-0.5 text-[12px] text-[#6B6A66]">
                  {
                    vehicle.licensePlate
                  }
                </p>
              </div>
            )}
        </div>


        {/* =================================================
         * STEPPER
         * =============================================== */}

        <VehicleStepper
          step={
            vehicleForm.step
          }
        />


        {/* =================================================
         * STEP CONTENT
         * =============================================== */}

        <div className="mt-5">
          {vehicleForm.step ===
            1 &&
            !isUpdatingDocuments && (
              <VehicleDataStep
                form={
                  vehicleForm.form
                }
                updateField={
                  vehicleForm.updateField
                }
              />
            )}


          {vehicleForm.step ===
  2 && (
    <VehicleDocumentsStep
      form={
        vehicleForm.form
      }

      showDesignatedDrivers={
        !isUpdatingDocuments
      }

      designatedDrivers={
        vehicleForm.designatedDrivers
      }

      onAddDesignatedDriver={
        vehicleForm.addDesignatedDriver
      }

      onUpdateDesignatedDriver={
        vehicleForm.updateDesignatedDriver
      }

      onRemoveDesignatedDriver={
        vehicleForm.removeDesignatedDriver
      }

      onUploadDesignatedDriverDniFront={
        vehicleForm.uploadDesignatedDriverDniFront
      }

      onUploadDesignatedDriverDniBack={
        vehicleForm.uploadDesignatedDriverDniBack
      }

      onUploadDesignatedDriverLicense={
        vehicleForm.uploadDesignatedDriverLicense
      }

      onClearDesignatedDriverDniFront={
        vehicleForm.clearDesignatedDriverDniFront
      }

      onClearDesignatedDriverDniBack={
        vehicleForm.clearDesignatedDriverDniBack
      }

      onClearDesignatedDriverLicense={
        vehicleForm.clearDesignatedDriverLicense
      }

      onUploadInsurance={
        vehicleForm.uploadInsurance
      }

      onUploadDriverLicense={
        vehicleForm.uploadDriverLicense
      }

      onUploadDniFront={
        vehicleForm.uploadDniFront
      }

      onUploadDniBack={
        vehicleForm.uploadDniBack
      }

      onUploadRegistrationCard={
        vehicleForm.uploadRegistrationCard
      }

      onClearInsurance={
        vehicleForm.clearInsurance
      }

      onClearDriverLicense={
        vehicleForm.clearDriverLicense
      }

      onClearDniFront={
        vehicleForm.clearDniFront
      }

      onClearDniBack={
        vehicleForm.clearDniBack
      }

      onClearRegistrationCard={
        vehicleForm.clearRegistrationCard
      }
    />
  )}


          {vehicleForm.step ===
            3 && (
              <VehicleReviewStep
  form={
    vehicleForm.form
  }
  designatedDrivers={
    vehicleForm.designatedDrivers
  }
/>
            )}
        </div>


        {/* =================================================
         * ACTIONS
         * =============================================== */}

        <div className="mt-6 space-y-2">
          {vehicleForm.step ===
            1 &&
            !isUpdatingDocuments && (
              <button
                type="button"
                onClick={() =>
                  vehicleForm
                    .setStep(
                      2,
                    )
                }
                disabled={
                  !vehicleForm
                    .dataStepValid
                }
                className="wayco-btn wayco-btn-primary disabled:opacity-40"
              >
                Continuar
              </button>
            )}


          {vehicleForm.step ===
            2 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    vehicleForm
                      .setStep(
                        3,
                      )
                  }
                  disabled={
                    !vehicleForm
                      .documentsStepValid
                  }
                  className="wayco-btn wayco-btn-primary disabled:opacity-40"
                >
                  Continuar
                </button>


                <button
                  type="button"
                  onClick={
                    handleDocumentsBack
                  }
                  className="wayco-btn wayco-btn-secondary"
                >
                  {isUpdatingDocuments
                    ? "Cancelar"
                    : "Volver"}
                </button>
              </>
            )}


          {vehicleForm.step ===
            3 && (
              <>
                <button
                  type="button"
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    vehicleForm.saving
                  }
                  className="wayco-btn wayco-btn-primary disabled:opacity-50"
                >
                  {vehicleForm.saving
                    ? "Enviando…"
                    : isUpdatingDocuments
                      ? "Enviar documentación"
                      : "Enviar para validación"}
                </button>


                <button
                  type="button"
                  onClick={() =>
                    vehicleForm
                      .setStep(
                        2,
                      )
                  }
                  disabled={
                    vehicleForm.saving
                  }
                  className="wayco-btn wayco-btn-secondary disabled:opacity-50"
                >
                  Volver
                </button>
              </>
            )}
        </div>
      </BottomSheet>


      {/* ===================================================
       * CONFIRMATION
       * ================================================= */}

      {vehicleForm.confirmationVisible && (
        <VehicleConfirmationOverlay
          onClose={
            closeConfirmation
          }
        />
      )}
    </>
  );
}