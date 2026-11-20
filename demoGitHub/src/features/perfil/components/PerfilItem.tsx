import type { ReactNode } from "react";

import { Link } from "@tanstack/react-router";

import { ChevronRight } from "lucide-react";

type PerfilItemProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  to?: string;
  primary?: boolean;
};

export function PerfilItem({
  icon,
  title,
  subtitle,
  onClick,
  to,
  primary,
}: PerfilItemProps) {
  const content = (
    <div
      className="flex items-center gap-4 p-4"
      style={{
        borderTop: "1px solid #F2F1ED",
      }}
    >
      <span
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center"
        style={{
          color: primary ? "#1D9E75" : "#6B6A66",
        }}
      >
        <span
          style={{
            display: "inline-flex",
          }}
        >
          {icon}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-[#111110]">
          {title}
        </p>

        {subtitle && (
          <p className="mt-0.5 truncate text-[12px] text-[#6B6A66]">
            {subtitle}
          </p>
        )}
      </div>

      {(onClick || to) && (
        <ChevronRight className="h-5 w-5 text-[#D3D1C7]" />
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="block first:[&>div]:!border-t-0"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className="block w-full text-left first:[&>div]:!border-t-0 disabled:opacity-60"
    >
      {content}
    </button>
  );
}