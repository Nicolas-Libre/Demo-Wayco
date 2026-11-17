import {
  Check,
} from "lucide-react";

import {
  normalizeLicensePlate,
} from "@wayco/shared/vehicles";

import type {
  VehicleFormState,
} from "../types/vehicle_form_types";

import type {
  DesignatedDriverFormState,
} from "./DesignatedDriverForm";


type Props = {
  form:
    VehicleFormState;

  designatedDrivers:
    DesignatedDriverFormState[];
};


export function VehicleReviewStep({
  form,
  designatedDrivers,
}: Props) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
        Revisá antes de enviar
      </p>


      {/* ===================================================
       * VEHÍCULO
       * =================================================== */}

      <div
        className="rounded-[16px] bg-white p-5"
        style={{
          border:
            "1px solid #E2E0D8",
        }}
      >
        <ReviewRow
          label="Vehículo"
          value={`${form.brand} ${form.model} ${form.year}`}
        />

        <Separator />

        <ReviewRow
          label="Dominio"
          value={
            normalizeLicensePlate(
              form.licensePlate,
            )
          }
        />

        <Separator />

        <ReviewRow
          label="Combustible"
          value={
            form.fuelType
          }
        />

        <Separator />

        <ReviewRow
          label="Consumo"
          value={`${form.consumptionL100Km} L/100km`}
        />
      </div>


      {/* ===================================================
       * DOCUMENTACIÓN TITULAR
       * =================================================== */}

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
          Documentación
        </p>

        <div
          className="rounded-[16px] bg-white p-5"
          style={{
            border:
              "1px solid #E2E0D8",
          }}
        >
          <DocumentRow
            label="Seguro"
          />

          <Separator />

          <DocumentRow
            label="Licencia de conducir"
          />

          <Separator />

          <DocumentRow
            label="DNI - frente"
          />

          <Separator />

          <DocumentRow
            label="DNI - dorso"
          />

          <Separator />

          <DocumentRow
            label="Cédula verde"
          />
        </div>
      </div>


      {/* ===================================================
       * CONDUCTORES DESIGNADOS
       * =================================================== */}

      {designatedDrivers.length >
        0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
            Conductores designados
          </p>

          <div className="space-y-3">
            {designatedDrivers.map(
              (
                driver,
                index,
              ) => (
                <div
                  key={
                    driver.id
                  }
                  className="rounded-[16px] bg-white p-5"
                  style={{
                    border:
                      "1px solid #E2E0D8",
                  }}
                >
                  <p className="mb-2 text-[13px] font-semibold text-[#111110]">
                    Conductor designado{" "}
                    {index + 1}
                  </p>

                  <Separator />

                  <ReviewRow
                    label="Nombre"
                    value={
                      driver.name.trim()
                    }
                  />

                  <Separator />

                  <ReviewRow
                    label="Apellido"
                    value={
                      driver.surname.trim()
                    }
                  />

                  <Separator />

                  <ReviewRow
                    label="DNI"
                    value={
                      driver.dni.trim()
                    }
                  />

                  <Separator />

                  <DocumentRow
                    label="DNI - frente"
                  />

                  <Separator />

                  <DocumentRow
                    label="DNI - dorso"
                  />

                  <Separator />

                  <DocumentRow
                    label="Licencia de conducir"
                  />
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function ReviewRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="shrink-0 text-[12px] text-[#6B6A66]">
        {label}
      </span>

      <span className="text-right text-[14px] font-medium text-[#111110]">
        {value}
      </span>
    </div>
  );
}


function DocumentRow({
  label,
}: {
  label:
    string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[12px] text-[#6B6A66]">
        {label}
      </span>

      <span className="inline-flex items-center gap-1.5 text-right text-[14px]">
        <Check
          className="h-4 w-4 shrink-0 text-[#1D9E75]"
          strokeWidth={
            3
          }
        />

        Documento cargado
      </span>
    </div>
  );
}


function Separator() {
  return (
    <div
      className="h-px w-full"
      style={{
        background:
          "#F2F1ED",
      }}
    />
  );
}