import isologoAsset from "@/assets/isologo-wayco.png";

type WaycoLogoProps = {
  size?: number;
};

export function WaycoLogo({
  size = 40,
}: WaycoLogoProps) {
  return (
    <img
      src={isologoAsset}
      alt="Wayco"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        display: "block",
      }}
      draggable={false}
    />
  );
}

type WaycoWordmarkProps = {
  size?: number;
};

export function WaycoWordmark({
  size = 80,
}: WaycoWordmarkProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <WaycoLogo size={size} />

      <span className="text-[28px] font-bold tracking-tight text-white">
        Wayco
      </span>
    </div>
  );
}
