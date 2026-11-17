type TripRouteProps = {
  origin: string;
  destination: string;
  originAddress?: string | null;
  destinationAddress?: string | null;
  time?: string;
  durationMinutes?: number;
  size?: "md" | "lg";
  showTimeSuffix?: boolean;
};

export function TripRoute({
  origin,
  destination,
  originAddress,
  destinationAddress,
  time,
  durationMinutes,
  size = "md",
  showTimeSuffix = true,
}: TripRouteProps) {
  const isLarge = size === "lg";
  const dotSize = isLarge ? 10 : 8;

  const textSize = isLarge
    ? "text-[16px]"
    : "text-[14px]";

  return (
    <div className="flex items-stretch gap-3">
      <div className="flex flex-col items-center pt-1">
        <span
          className="shrink-0 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: "var(--green-primary)",
          }}
        />

        <span
          className="my-1 flex-1"
          style={{
            width: 0,
            minHeight: 16,
            borderLeft:
              "1.5px dashed var(--border-color)",
          }}
        />

        <span
          className="shrink-0 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: "var(--text-secondary)",
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className={`${isLarge ? "" : "truncate"} ${textSize} font-semibold text-[var(--text-primary)]`}
            >
              {origin}
            </p>

            {isLarge && originAddress && (
              <p className="mt-1 break-words text-[12px] leading-relaxed text-[var(--text-secondary)]">
                {originAddress}
              </p>
            )}
          </div>

          {time && (
            <p className="shrink-0 whitespace-nowrap text-[14px] font-semibold text-[var(--text-primary)]">
              {time}
              {showTimeSuffix ? " hs" : ""}
            </p>
          )}
        </div>

        <div
          className="mt-3 flex items-start justify-between gap-3"
        >
          <div className="min-w-0 flex-1">
            <p
              className={`${isLarge ? "" : "truncate"} ${textSize} font-semibold text-[var(--text-primary)]`}
            >
              {destination}
            </p>

            {isLarge && destinationAddress && (
              <p className="mt-1 break-words text-[12px] leading-relaxed text-[var(--text-secondary)]">
                {destinationAddress}
              </p>
            )}
          </div>

          {durationMinutes != null && (
            <p className="shrink-0 whitespace-nowrap text-[12px] text-[var(--text-secondary)]">
              ~{Math.round(durationMinutes)} min
            </p>
          )}
        </div>
      </div>
    </div>
  );
}