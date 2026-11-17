import type { ReactNode } from "react";

type SectionHeaderProps = {
  children: ReactNode;
  action?: ReactNode;
};

export function SectionHeader({
  children,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="wayco-section-label">
        {children}
      </span>

      {action}
    </div>
  );
}
