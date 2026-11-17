import type {
  VehicleValidationStatus,
} from "@wayco/shared/vehicles";


const STATUS_STYLES: Record<
  VehicleValidationStatus,
  {
    background:
      string;

    color:
      string;

    label:
      string;
  }
> = {
  pendiente: {
    background:
      "#FEF9C3",

    color:
      "#92400E",

    label:
      "En revisión",
  },

  aprobado: {
    background:
      "#E8F5F0",

    color:
      "#0F6E56",

    label:
      "Aprobado",
  },

  rechazado: {
    background:
      "#FEE2E2",

    color:
      "#991B1B",

    label:
      "Requiere corrección",
  },

  dado_de_baja: {
    background:
      "#F2F1ED",

    color:
      "#6B6A66",

    label:
      "Dado de baja",
  },
  
  eliminado: {
    background: "bg-gray-100",
    color: "text-gray-500",
    label: "Eliminado",
  },
};


export function VehicleValidationBadge({
  status,
}: {
  status:
    VehicleValidationStatus;
}) {
  const style =
    STATUS_STYLES[
      status
    ];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{
        background:
          style.background,

        color:
          style.color,
      }}
    >
      {style.label}
    </span>
  );
}