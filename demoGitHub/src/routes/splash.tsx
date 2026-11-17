import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { WaycoWordmark } from "@/components/branding/WaycoBrand";

export const Route = createFileRoute("/splash")({
  head: () => ({
    meta: [
      { title: "Wayco — Compartí el camino" },
      { name: "description", content: "Viajes compartidos La Plata–CABA. Reservá tu asiento o publicá tu viaje." },
    ],
  }),
  component: SplashPage,
});

function SplashPage() {
  const [leaving, setLeaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  let cancelled =
    false;

  const timer =
    window.setTimeout(
      async () => {
        setLeaving(
          true,
        );

        /*
         * Al iniciar Wayco eliminamos cualquier
         * sesión almacenada previamente.
         *
         * De esta forma el usuario siempre comienza
         * desde Welcome y decide si quiere iniciar
         * sesión o registrarse.
         */
        if (import.meta.env.VITE_DEMO_MODE !== "true") {
          await supabase.auth.signOut();
        }

        if (
          cancelled
        ) {
          return;
        }

        window.setTimeout(
          () => {
            if (
              cancelled
            ) {
              return;
            }

            void navigate({ to: "/welcome", replace: true });
          },
          300,
        );
      },
      1700,
    );

  return () => {
    cancelled =
      true;

    window.clearTimeout(
      timer,
    );
  };
}, [navigate]);

  return (
    <div className="wayco-shell flex min-h-screen flex-col items-center justify-center" style={{ backgroundColor: "var(--bg-dark)" }}>
      <div className={leaving ? "opacity-0 transition-opacity duration-300" : "animate-wayco-fade"}>
        <WaycoWordmark size={80} />
        <p className="mt-3 text-center text-[16px]" style={{ color: "var(--green-accent)" }}>
          Compartí el camino
        </p>
      </div>
    </div>
  );
}



