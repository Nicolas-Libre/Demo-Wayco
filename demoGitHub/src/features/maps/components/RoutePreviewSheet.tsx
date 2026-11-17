import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  LoaderCircle,
} from "lucide-react";

import type {
  TripLocationPoint,
  TripRouteSnapshot,
} from "@wayco/shared/trips";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

import { DemoIllustratedMap } from "./DemoIllustratedMap";




type RoutePreviewSheetProps = {
  open:
    boolean;

  origin:
    TripLocationPoint;

  destination:
    TripLocationPoint;

  route:
    TripRouteSnapshot;

  onClose:
    () => void;

  onChangeOrigin:
    () => void;

  onChangeDestination:
    () => void;
};


export function RoutePreviewSheet({
  open,
  origin,
  destination,
  route,
  onClose,
  onChangeOrigin,
  onChangeDestination,
}: RoutePreviewSheetProps) {
  const mapContainerRef =
    useRef<HTMLDivElement | null>(
      null,
    );


  const [
    loading,
    setLoading,
  ] =
    useState(
      false,
    );


  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null,
    );




  return (
    <BottomSheet
      open={
        open
      }
      onClose={
        onClose
      }
      title="Ver ruta"
      tall
    >
      <div className="flex min-h-full flex-col">
        {/* =====================================================
         * ROUTE SUMMARY
         * =================================================== */}

        <div className="mb-4 rounded-[14px] border border-[#9FE1CB] bg-[#E8F5F0] p-4">
          <p className="text-[13px] font-semibold text-[#0F6E56]">
            Ruta calculada
          </p>

          <p className="mt-1 text-[12px] text-[#111110]">
            {(route.distanceMeters / 1000).toFixed(
              1,
            )}{" "}
            km ·{" "}
            {Math.ceil(
              route.durationSeconds /
                60,
            )}{" "}
            min
          </p>
        </div>


        {/* =====================================================
         * MAP
         * =================================================== */}

        <div className="relative overflow-hidden rounded-[16px] border border-[#E2E0D8]">
          <DemoIllustratedMap className="h-[380px] w-full" origin={origin} destination={destination} />


          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="flex flex-col items-center gap-2">
                <LoaderCircle className="size-6 animate-spin text-[#1D9E75]" />

                <p className="text-[12px] font-medium text-[#6B6A66]">
                  Cargando ruta…
                </p>
              </div>
            </div>
          )}
        </div>


        {/* =====================================================
         * ERROR
         * =================================================== */}

        {errorMessage && (
          <div className="mt-4 rounded-[12px] border border-red-300 bg-red-50 p-3">
            <p className="text-[12px] font-medium text-red-700">
              {errorMessage}
            </p>
          </div>
        )}


        {/* =====================================================
         * LOCATIONS
         * =================================================== */}

        <div className="mt-4 space-y-3">
          {/* ORIGIN */}

          <div className="flex items-start gap-3 rounded-[12px] bg-[#E8F5F0] p-3">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1D9E75]">
              <span className="text-[11px] font-bold text-white">
                O
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#0F6E56]">
                  Origen
                </p>

                <button
                  type="button"
                  onClick={
                    onChangeOrigin
                  }
                  className="shrink-0 text-[12px] font-semibold text-[#0F6E56] transition-opacity hover:opacity-70"
                >
                  Cambiar
                </button>
              </div>

              <p className="mt-0.5 text-[12px] leading-[1.4] text-[#111110]">
                {origin.address}
              </p>
            </div>
          </div>


          {/* DESTINATION */}

          <div className="flex items-start gap-3 rounded-[12px] bg-[#F2F1ED] p-3">
            <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[#111110]">
                <span className="text-[11px] font-bold text-white">
                    D
                </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6B6A66]">
                  Destino
                </p>

                <button
                  type="button"
                  onClick={
                    onChangeDestination
                  }
                  className="shrink-0 text-[12px] font-semibold text-[#111110] transition-opacity hover:opacity-60"
                >
                  Cambiar
                </button>
              </div>

              <p className="mt-0.5 text-[12px] leading-[1.4] text-[#111110]">
                {destination.address}
              </p>
            </div>
          </div>
        </div>


        {/* =====================================================
         * CLOSE
         * =================================================== */}

        <button
          type="button"
          onClick={
            onClose
          }
          className="wayco-btn wayco-btn-primary mt-5"
        >
          Cerrar
        </button>
      </div>
    </BottomSheet>
  );
}