import {
  FileText,
  Power,
} from "lucide-react";

import type {
  AdminVehicle,
} from "@wayco/shared/admin";

import {
  VehicleValidationBadge,
} from "@/features/vehicles/components/VehicleValidationBadge";


type AdminApprovedVehicleCardProps = {
  vehicle:
    AdminVehicle;

  onDocuments:
    () => void;
};


export function AdminApprovedVehicleCard({
  vehicle,
  onDocuments,
}: AdminApprovedVehicleCardProps) {
  return (
    <div className="rounded-[20px] border border-[#E5E4DF] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[16px] font-bold text-[#111110]">
            {vehicle.brand}{" "}
            {vehicle.model}
          </p>

          <p className="mt-0.5 text-[13px] text-[#6B6A66]">
            {vehicle.year} ·{" "}
            {vehicle.patent}
          </p>
        </div>

        <VehicleValidationBadge
          status={
            vehicle.validationState
          }
        />
      </div>


      <div className="mt-4 border-t border-[#F0EFEA] pt-3">
        <p className="text-[12px] font-medium text-[#8A8984]">
          Propietario
        </p>

        <p className="mt-0.5 truncate text-[14px] font-semibold text-[#111110]">
          {vehicle.driver?.name ??
            "Usuario no disponible"}
        </p>

        {vehicle.driver?.email && (
          <p className="mt-0.5 truncate text-[12px] text-[#6B6A66]">
            {vehicle.driver.email}
          </p>
        )}
      </div>


      {vehicle.validatedAt && (
        <p className="mt-3 text-[12px] text-[#8A8984]">
          Aprobado el{" "}
          {format_date(
            vehicle.validatedAt,
          )}
        </p>
      )}


      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={
            onDocuments
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] border border-[#D8D7D2] px-3 text-[13px] font-semibold text-[#111110] transition active:scale-[0.99]"
        >
          <FileText className="h-4 w-4 shrink-0" />

          <span>
            Ver Información
          </span>
        </button>


        <button
          type="button"
          onClick={
            onDocuments
          }
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] bg-red-600 px-3 text-[13px] font-semibold text-white transition hover:bg-red-700 active:scale-[0.99]"
        >
          <Power className="h-4 w-4 shrink-0" />

          <span>
            Dar de baja
          </span>
        </button>
      </div>
    </div>
  );
}


function format_date(
  value:
    string,
): string {
  const date =
    new Date(
      value,
    );


  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }


  return new Intl.DateTimeFormat(
    "es-AR",
    {
      day:
        "2-digit",

      month:
        "2-digit",

      year:
        "numeric",
    },
  ).format(
    date,
  );
}