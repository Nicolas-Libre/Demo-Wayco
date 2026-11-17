import { Link } from "@tanstack/react-router";
import {
  Home, Search,Plus, Calendar, User, type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const left: NavigationItem[] = [
  { to: "/auth/home", label: "Inicio", icon: Home },
  { to: "/buscar", label: "Buscar", icon: Search },
];

const right: NavigationItem[] = [
  { to: "/mis-viajes", label: "Mis viajes", icon: Calendar },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 bg-white"
      style={{
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div className="relative mx-auto flex h-16 w-full max-w-[420px] items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
        {left.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <div className="relative flex w-16 items-start justify-center">
          <Link
            to="/publicar"
            aria-label="Publicar viaje"
            className="absolute -top-5 inline-flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform active:scale-95"
            style={{
              background: "var(--green-primary)",
              boxShadow: "var(--shadow-fab)",
            }}
          >
            <Plus
              className="h-6 w-6"
              strokeWidth={2.2}
            />
          </Link>

          <span className="mt-10 text-[10px] font-medium text-[var(--text-secondary)]">
            Publicar
          </span>
        </div>

        {right.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
}: NavigationItem) {
  return (
    <Link
      to={to}
      className="flex min-w-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-md px-1 text-[10px] font-medium text-[#9B9A96] transition-colors"
      activeProps={{
        className:
          "text-[color:var(--green-primary)] !font-semibold",
      }}
      activeOptions={{ exact: true }}
    >
      <Icon
        className="h-[22px] w-[22px]"
        strokeWidth={1.5}
      />

      <span>{label}</span>
    </Link>
  );
}
