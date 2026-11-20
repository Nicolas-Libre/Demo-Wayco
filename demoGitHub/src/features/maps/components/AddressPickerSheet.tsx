import { useEffect, useState } from "react";
import { Check, MapPin, Search } from "lucide-react";
import type { TripLocationPoint } from "@wayco/shared/trips";
import { BottomSheet } from "@/components/overlays/BottomSheet";
import type { WaycoArea } from "../config/wayco_areas";
import { findDemoAddress, searchDemoAddresses, type DemoAddress } from "../config/local_demo_addresses";

interface AddressPickerSheetProps {
  open: boolean;
  type: "origin" | "destination";
  area: WaycoArea | null;
  initialPoint?: TripLocationPoint | null;
  onClose: () => void;
  onConfirm: (point: TripLocationPoint) => void;
}

/** Mismo BottomSheet de Wayco, sin cargar Google Places ni usar servicios externos. */
export function AddressPickerSheet({ open, type, area, initialPoint = null, onClose, onConfirm }: AddressPickerSheetProps) {
  const [query, setQuery] = useState("");
  const [selectedPoint, setSelectedPoint] = useState<DemoAddress | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const initial = initialPoint ? findDemoAddress(initialPoint.address) : undefined;
    const valid = initial?.locality === area?.name ? initial : null;
    setSelectedPoint(valid);
    setQuery(valid?.address ?? "");
    setErrorMessage(null);
  }, [open, area?.name, initialPoint?.address]);

  const matches = area ? searchDemoAddresses(query, area.name) : [];
  const hasExactSelection = selectedPoint !== null && query === selectedPoint.address;

  function choose(point: DemoAddress) {
    setSelectedPoint(point);
    setQuery(point.address);
    setErrorMessage(null);
  }

  function confirm() {
    if (!area) return;
    if (!hasExactSelection || selectedPoint.locality !== area.name) {
      setErrorMessage("Seleccioná una dirección válida del catálogo de sugerencias.");
      return;
    }
    onConfirm({ address: selectedPoint.address, locality: selectedPoint.locality, lat: selectedPoint.lat, lng: selectedPoint.lng });
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={type === "origin" ? "Dirección de origen" : "Dirección de destino"}>
      {!area ? (
        <p className="text-[13px] text-[#6B6A66]">Primero seleccioná una localidad.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-[13px] text-[#6B6A66]">Escribí la calle y el número de la dirección.</p>
            <p className="mt-1 text-[12px] font-semibold text-[#0F6E56]">Localidad: {area.name}</p>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-[#0F6E56]" />
            <input
              type="text"
              aria-label={type === "origin" ? "Dirección de origen" : "Dirección de destino"}
              autoComplete="off"
              placeholder={type === "origin" ? "Escribí la dirección de origen" : "Escribí la dirección de destino"}
              className="min-h-[48px] w-full rounded-[12px] border border-[#E5E4DF] bg-white py-3 pl-10 pr-3 text-[13px] text-[#111110] outline-none focus:border-[#1D9E75]"
              value={query}
              onChange={event => { setQuery(event.target.value); setSelectedPoint(null); setErrorMessage(null); }}
            />
          </div>
          {!hasExactSelection && (
            <div className="max-h-52 overflow-y-auto rounded-[12px] border border-[#E5E4DF] bg-white">
              {matches.length ? matches.map(point => (
                <button key={point.id} type="button" onClick={() => choose(point)} className="flex w-full items-center gap-2 border-b border-[#F2F1ED] px-3 py-3 text-left text-[13px] text-[#111110] last:border-b-0 hover:bg-[#E8F5F0]">
                  <MapPin className="size-4 shrink-0 text-[#1D9E75]" />{point.address}
                </button>
              )) : <p className="p-3 text-[12px] text-[#6B6A66]">No encontramos esa dirección en el catálogo de {area.name}.</p>}
            </div>
          )}
          {hasExactSelection && (
            <div className="rounded-[12px] border border-[#9FE1CB] bg-[#E8F5F0] p-3">
              <div className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-[#0F6E56]" />
                <div className="min-w-0"><p className="text-[12px] font-semibold text-[#0F6E56]">Dirección seleccionada</p>
                  <p className="mt-1 text-[13px] text-[#111110]">{selectedPoint.address}</p></div>
              </div>
            </div>
          )}
          {errorMessage && <div className="rounded-[12px] border border-red-200 bg-red-50 p-3"><p className="text-[12px] text-red-700">{errorMessage}</p></div>}
          <button type="button" onClick={confirm} disabled={!hasExactSelection} className="wayco-btn wayco-btn-primary disabled:opacity-40">
            <MapPin className="mr-2 inline size-4" />Confirmar dirección
          </button>
          <button type="button" onClick={onClose} className="wayco-btn wayco-btn-secondary">Volver</button>
        </div>
      )}
    </BottomSheet>
  );
}
