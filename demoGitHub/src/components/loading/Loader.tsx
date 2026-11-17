import { WaycoLogo } from "@/components/branding/WaycoBrand";

type WaycoFullScreenLoaderProps = {
  label?: string;
};

export function WaycoFullScreenLoader({
  label = "Cargando...",
}: WaycoFullScreenLoaderProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="wayco-loader-pulse">
        <WaycoLogo size={56} />
      </div>

      {label && (
        <p className="mt-4 text-[14px] font-medium text-[#04cñ342C]">
          {label}
        </p>
      )}
    </div>
  );
}
