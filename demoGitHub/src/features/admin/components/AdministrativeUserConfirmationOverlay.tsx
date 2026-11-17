import {
  ShieldCheck,
} from "lucide-react";

import {
  DelayedConfirmationButton,
} from "@/components/feedback/DelayedConfirmationButton";


type AdministrativeUserConfirmationOverlayProps = {
  name:
    string;

  surname:
    string;

  email:
    string;

  onClose:
    () => void;
};


export function AdministrativeUserConfirmationOverlay({
  name,
  surname,
  email,
  onClose,
}: AdministrativeUserConfirmationOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-white px-6 text-center"
      style={{
        animation:
          "wayco-admin-confirmation-in 400ms ease-out",
      }}
    >
      <style>{`
        @keyframes wayco-admin-confirmation-in {
          from {
            opacity: 0;
            transform: scale(0.96);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>


      <div className="flex items-center gap-2">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 16l1.5-4h11L19 16M5 16h14v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3z"
            fill="#1D9E75"
          />

          <circle
            cx="8"
            cy="17"
            r="1.2"
            fill="#04342C"
          />

          <circle
            cx="16"
            cy="17"
            r="1.2"
            fill="#04342C"
          />
        </svg>

        <span className="text-[22px] font-bold text-[#111110]">
          Wayco
        </span>
      </div>


      <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5F0]">
        <ShieldCheck className="h-8 w-8 text-[#1D9E75]" />
      </div>


      <h2 className="mt-5 text-[22px] font-bold text-[#111110]">
        ¡Administrativo creado!
      </h2>


      <p className="mt-2 max-w-[320px] text-[15px] leading-[1.6] text-[#6B6A66]">
        {name} {surname} ya tiene una cuenta administrativa activa en Wayco.
      </p>


      <div className="mt-5 w-full max-w-[320px] rounded-[12px] border border-[#CDE8DF] bg-[#F4FAF7] px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B6A66]">
          Email de acceso
        </p>

        <p className="mt-1 break-all text-[14px] font-semibold text-[#111110]">
          {email}
        </p>
      </div>


      <p className="mt-4 max-w-[320px] text-[13px] leading-[1.5] text-[#6B6A66]">
        La cuenta puede utilizarse inmediatamente para iniciar sesión. No será necesaria la confirmación por email.
      </p>


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