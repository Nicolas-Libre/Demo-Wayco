import {
  Clock,
} from "lucide-react";

import {
  DelayedConfirmationButton,
} from "@/components/feedback/DelayedConfirmationButton";

import waycoLogo from "@/assets/isologo-wayco.png";


type VehicleConfirmationOverlayProps = {
  onClose:
    () => void;
};


export function VehicleConfirmationOverlay({
  onClose,
}: VehicleConfirmationOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white px-6 text-center"
      style={{
        animation:
          "wayco-fade-in 400ms ease-out",
      }}
    >
      <style>{`
        @keyframes wayco-fade-in {
          from {
            opacity: 0;
            transform: scale(0.96);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes wayco-clock-spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .wayco-clock-anim {
          animation: wayco-clock-spin 3s linear infinite;
          transform-origin: center;
        }
      `}</style>


      {/* =================================================
       * WAYCO BRAND
       * =============================================== */}

      <div className="flex items-center gap-2">
        <img
  src={waycoLogo}
  alt=""
  aria-hidden="true"
  className="h-9 w-9 object-contain"
/>

        <span className="text-[22px] font-bold text-[#111110]">
          Wayco
        </span>
      </div>


      {/* =================================================
       * STATUS
       * =============================================== */}

      <div className="mt-8">
        <Clock
          className="wayco-clock-anim mx-auto h-12 w-12"
          style={{
            color:
              "#1D9E75",
          }}
        />
      </div>

      <h2 className="mt-4 text-[22px] font-bold text-[#111110]">
        ¡Documentación recibida!
      </h2>

      <p className="mt-2 max-w-[300px] text-[15px] leading-[1.6] text-[#6B6A66]">
        El equipo de Wayco revisará tu información en un plazo
        de 24 a 48 horas hábiles. Te notificaremos por email y
        desde la app cuando tu perfil de conductor esté aprobado.
      </p>


      {/* =================================================
       * ACTION
       * =============================================== */}

      <div className="mt-8 w-[280px]">
        <DelayedConfirmationButton
          onConfirm={
            onClose
          }
        />
      </div>
    </div>
  );
}