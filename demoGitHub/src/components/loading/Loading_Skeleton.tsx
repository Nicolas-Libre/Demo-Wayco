import type { CSSProperties } from "react";

type Loading_SkeletonProps = {
  className?: string;
  style?: CSSProperties;
};

export function Loading_Skeleton({
  className = "",
  style,
}: Loading_SkeletonProps) {
  return (
    <div
      className={`wayco-skeleton ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
