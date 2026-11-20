import type { ReactNode } from "react";

type PerfilImpactLabelProps = {
  children: ReactNode;
};

export function PerfilImpactLabel({
  children,
}: PerfilImpactLabelProps) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-wider"
      style={{
        color: "#0F6E56",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </p>
  );
}