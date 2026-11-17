import type { TripBadgeTone } from "../types/trip-card.types";

type TripBadgeProps = {
  label: string;
  tone: TripBadgeTone;
};

const badgeStyles: Record<
  TripBadgeTone,
  { background: string; color: string }
> = {
  success: {
    background: "#E8F5F0",
    color: "#0F6E56",
  },
  warning: {
    background: "#FEF9C3",
    color: "#854D0E",
  },
  neutral: {
    background: "#F2F1ED",
    color: "#6B6A66",
  },
};

export function TripBadge({
  label,
  tone,
}: TripBadgeProps) {
  const styles = badgeStyles[tone];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={styles}
    >
      {label}
    </span>
  );
}
