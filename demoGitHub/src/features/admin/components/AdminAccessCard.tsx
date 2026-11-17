import {
  Link,
} from "@tanstack/react-router";

import {
  ChevronRight,
  ShieldCheck,
} from "lucide-react";


export function AdminAccessCard() {
  return (
    <Link
      to="/admin"
      className="block"
    >
      <div
        className="flex items-center gap-4 rounded-[14px] border bg-white p-4 transition-colors hover:bg-[#F8FAF9]"
        style={{
          borderColor:
            "#CDE8DF",
        }}
      >
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              "#E8F5F0",
            color:
              "#1D9E75",
          }}
        >
          <ShieldCheck className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[#111110]">
            Panel administrativo
          </p>

          <p className="mt-0.5 text-[12px] leading-[1.5] text-[#6B6A66]">
            Revisá solicitudes pendientes de vehículos
          </p>
        </div>

        <ChevronRight className="h-5 w-5 shrink-0 text-[#B7B5AE]" />
      </div>
    </Link>
  );
}