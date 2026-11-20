type PerfilImpactStatProps = {
  numero: string;
  desc: string;
  className?: string;
};

export function PerfilImpactStat({
  numero,
  desc,
  className,
}: PerfilImpactStatProps) {
  return (
    <div
      className={`rounded-[12px] p-[14px] text-center ${
        className ?? ""
      }`}
      style={{
        background: "#E8F5F0",
      }}
    >
      <p
        className="text-[20px] font-bold"
        style={{
          color: "#1D9E75",
        }}
      >
        {numero}
      </p>

      <p
        className="mt-1 text-[11px]"
        style={{
          color: "#6B6A66",
          lineHeight: 1.4,
        }}
      >
        {desc}
      </p>
    </div>
  );
}