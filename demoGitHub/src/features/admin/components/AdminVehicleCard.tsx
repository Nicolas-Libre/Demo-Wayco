import type {
  AdminVehicle,
} from "@wayco/shared/admin";

import {
  VehicleValidationBadge,
} from "@/features/vehicles/components/VehicleValidationBadge";


type AdminVehicleCardProps = {
  vehicle:
    AdminVehicle;

  onOpen:
    (
      vehicle:
        AdminVehicle,
    ) => void;
};


export function AdminVehicleCard({
  vehicle,
  onOpen,
}: AdminVehicleCardProps) {
  return (
    <button
      type="button"
      onClick={() =>
        onOpen(
          vehicle,
        )
      }
      className="w-full rounded-[20px] border border-[#E5E4DF] bg-white p-4 text-left transition active:scale-[0.99]"
    >
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

      <div className="mt-4 flex items-center justify-between">
        <p className="text-[12px] text-[#8A8984]">
          Solicitud{" "}
          {format_date(
            vehicle.createdAt,
          )}
        </p>

        <span
          className="
            rounded-lg
            bg-green-900
            px-4
            py-2
            text-[13px]
            font-semibold
            text-white
            transition-colors
            hover:bg-green-700
          "
        >
          Revisar
        </span>
      </div>
    </button>
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