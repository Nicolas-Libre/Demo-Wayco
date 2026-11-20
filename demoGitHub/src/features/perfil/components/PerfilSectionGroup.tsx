import type { ReactNode } from "react";

type PerfilSectionGroupProps = {
  children: ReactNode;
};

export function PerfilSectionGroup({
  children,
}: PerfilSectionGroupProps) {
  return (
    <div
      className="overflow-hidden rounded-[12px] border bg-white"
      style={{
        borderColor: "#E2E0D8",
      }}
    >
      {children}
    </div>
  );
}