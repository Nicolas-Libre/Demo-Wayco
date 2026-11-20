type PerfilStatProps = {
  value: string;
  label: string;
  divider?: boolean;
};

export function PerfilStat({
  value,
  label,
  divider,
}: PerfilStatProps) {
  return (
    <div
      className={`py-[18px] text-center ${
        divider
          ? "border-l"
          : ""
      }`}
      style={
        divider
          ? {
              borderColor: "#E2E0D8",
            }
          : undefined
      }
    >
      <p className="text-[20px] font-bold text-[#111110]">
        {value}
      </p>

      <p
        className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B6A66]"
        style={{
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
    </div>
  );
}