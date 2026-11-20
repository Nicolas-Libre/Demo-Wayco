import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

import isologoWayco from "@/assets/isologo-wayco.png";
import { Avatar } from "@/components/data-display/UserAvatar";
import { formatDecimal } from "@/features/trips/utils/trip-formatters";

type PerfilHeaderProps = {
  fullName: string;
  email: string;
  co2Kg: number;
  profileRoleLabel: string | null;
};

export function PerfilHeader({
  fullName,
  email,
  co2Kg,
  profileRoleLabel,
}: PerfilHeaderProps) {
  return (
    <div
      className="relative overflow-hidden px-5 pb-8 pt-12 text-center"
      style={{
        background: "#04342C",
        minHeight: 360,
      }}
    >
      {/* ===============================================
       * WAYCO LOGO PATTERN
       * ============================================= */}

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <WaycoBackgroundLogo
          className="absolute -left-8 top-2 h-[145px] w-[145px]"
          opacity={0.16}
        />

        <WaycoBackgroundLogo
          className="absolute -right-8 top-2 h-[145px] w-[145px]"
          opacity={0.16}
        />

        <WaycoBackgroundLogo
          className="absolute left-1/2 top-[45px] h-[300px] w-[260px] -translate-x-1/2"
          opacity={0.13}
        />

        <WaycoBackgroundLogo
          className="absolute -bottom-10 -left-8 h-[145px] w-[145px]"
          opacity={0.14}
        />

        <WaycoBackgroundLogo
          className="absolute -bottom-10 -right-8 h-[145px] w-[145px]"
          opacity={0.14}
        />
      </div>

      {/* ===============================================
       * PROFILE CONTENT
       * ============================================= */}

      <div className="relative z-10 flex flex-col items-center">
        <div
          className="rounded-full p-[3px] shadow-lg"
          style={{
            background: "white",
          }}
        >
          <Avatar
            name={fullName}
            size={108}
          />
        </div>

        <div className="mt-7">
          <p className="text-[29px] font-bold leading-none tracking-tight text-white">
            {fullName || "—"}
          </p>

          <p
            className="mt-3 text-[15px] font-semibold"
            style={{
              color: "#9FE1CB",
            }}
          >
            Wayco Member
          </p>

          <p
            className="mt-1 text-[15px]"
            style={{
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {email}
          </p>
        </div>

        {/* CO₂ AHORRADO */}

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#9FE1CB]/40 bg-white/10 px-4 py-2">
          <Leaf className="h-4 w-4 text-[#9FE1CB]" />

          <span className="text-[13px] font-semibold text-white">
            {formatDecimal(co2Kg)} kg de CO₂ ahorrado
          </span>
        </div>

        {profileRoleLabel && (
          <span
            className="mt-5 inline-flex items-center rounded-full border px-5 py-1.5 text-[13px] font-semibold"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#9FE1CB",
              borderColor: "rgba(159,225,203,0.45)",
            }}
          >
            {profileRoleLabel}
          </span>
        )}
      </div>
    </div>
  );
}

function WaycoBackgroundLogo({
  className,
  opacity,
}: {
  className: string;
  opacity: number;
}) {
  const [
    processedLogo,
    setProcessedLogo,
  ] = useState<string | null>(null);

  useEffect(() => {
    const image = new Image();

    image.src = isologoWayco;

    image.onload = () => {
      const canvas = document.createElement(
        "canvas",
      );

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.drawImage(
        image,
        0,
        0,
      );

      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const pixels = imageData.data;

      for (
        let index = 0;
        index < pixels.length;
        index += 4
      ) {
        const red = pixels[index] ?? 0;
        const green = pixels[index + 1] ?? 0;
        const blue = pixels[index + 2] ?? 0;

        const luminance =
          0.2126 * red +
          0.7152 * green +
          0.0722 * blue;

        if (luminance < 135) {
          pixels[index + 3] = 0;

          continue;
        }

        pixels[index] = 159;
        pixels[index + 1] = 225;
        pixels[index + 2] = 203;

        const normalizedOpacity = Math.min(
          255,
          Math.max(
            0,
            (luminance - 135) * 2.2,
          ),
        );

        pixels[index + 3] = normalizedOpacity;
      }

      context.putImageData(
        imageData,
        0,
        0,
      );

      setProcessedLogo(
        canvas.toDataURL("image/png"),
      );
    };
  }, []);

  if (!processedLogo) {
    return null;
  }

  return (
    <img
      src={processedLogo}
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
      style={{
        opacity,
        objectFit: "contain",
      }}
    />
  );
}