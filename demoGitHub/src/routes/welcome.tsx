import { createFileRoute, Link } from "@tanstack/react-router";
import { WaycoLogo } from "@/components/branding/WaycoBrand";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Wayco — Bienvenido" },
      { name: "description", content: "Sumate a Wayco y compartí viajes entre La Plata y CABA." },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div
      className="wayco-shell flex min-h-screen flex-col px-6 pb-10 pt-16"
      style={{ backgroundColor: "var(--bg-dark)" }}
    >
      <div className="flex flex-1 flex-col items-center justify-center">
        <WaycoLogo size={80} />
        <span className="mt-5 text-[28px] font-bold tracking-tight text-white">Wayco</span>
        <p className="mt-2 text-[16px]" style={{ color: "var(--green-accent)" }}>
          Compartido es mejor
        </p>
      </div>

      <div className="space-y-3">
        <Link to="/register" className="wayco-btn wayco-btn-primary">
          Registrarse
        </Link>
        <Link to="/auth/login" className="wayco-btn wayco-btn-outline-light">
          Ya tengo cuenta
        </Link>
      </div>
    </div>
  );
}

