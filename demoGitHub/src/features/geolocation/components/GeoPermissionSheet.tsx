import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

import { BottomSheet } from "@/components/overlays/BottomSheet"
import { useGeolocationPermission } from "@/features/geolocation/hooks/useGeolocationPermission";
import type { GeoPermissionScope } from "@/features/geolocation/types/geolocation.types";

type GeoPermissionSheetProps = {
  scope: GeoPermissionScope;
};

export function GeoPermissionSheet({
  scope,
}: GeoPermissionSheetProps) {
  const {
    open,
    acceptPermission,
    denyPermission,
    closeSheet,
  } = useGeolocationPermission({
    scope,

    onGranted: () => {
      toast.success("Ubicación activada", {
        description:
          "Vamos a usarla para optimizar tu ruta y seguimiento.",
      });
    },

    onDenied: () => {
      toast("Sin problema", {
        description:
          "El viaje se procesará con ubicaciones manuales estándar.",
      });
    },

    onRequestError: (error) => {
      const message =
        error.code === error.PERMISSION_DENIED
          ? "Vas a poder seguir usando Wayco con ubicaciones manuales."
          : "No pudimos obtener tu ubicación. Seguimos con ubicaciones manuales.";

      toast(message);
    },
  });

  return (
    <BottomSheet
      open={open}
      onClose={closeSheet}
      title="Compartir tu ubicación"
    >
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "#E8F5EE" }}
      >
        <Navigation
          size={26}
          color="#1D9E75"
          aria-hidden="true"
        />
      </div>

      <p
        className="text-center text-[15px] leading-snug"
        style={{ color: "#111110" }}
      >
        Permitir compartir tu geolocalización en
        tiempo real con Wayco para optimizar tu ruta y
        seguimiento.
      </p>

      <div
        className="mt-4 rounded-[14px] p-3"
        style={{ background: "#F2F1ED" }}
      >
        <div className="flex items-start gap-2.5">
          <MapPin
            size={16}
            color="#6B6A66"
            className="mt-0.5 shrink-0"
            aria-hidden="true"
          />

          <p
            className="text-[12px] leading-snug"
            style={{ color: "#6B6A66" }}
          >
            Usamos tu ubicación solo durante el viaje
            para estimar tiempos de llegada y mostrarte
            rutas más precisas. Podés revocar el permiso
            desde tu navegador cuando quieras.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <button
          type="button"
          onClick={acceptPermission}
          className="w-full"
          style={{
            height: 52,
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 600,
            background: "#1D9E75",
            color: "#FFFFFF",
          }}
        >
          Permitir ubicación
        </button>

        <button
          type="button"
          onClick={denyPermission}
          className="w-full"
          style={{
            height: 48,
            borderRadius: 14,
            fontSize: 14,
            fontWeight: 500,
            background: "transparent",
            color: "#6B6A66",
          }}
        >
          Ahora no
        </button>
      </div>
    </BottomSheet>
  );
}
