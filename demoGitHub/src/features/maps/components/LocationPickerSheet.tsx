import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import type { TripLocationPoint } from "@wayco/shared/trips";
import { BottomSheet } from "@/components/overlays/BottomSheet";
import type { WaycoArea } from "../config/wayco_areas";
import { DemoIllustratedMap } from "./DemoIllustratedMap";

type Props = {open:boolean; type:"origin"|"destination"; area:WaycoArea|null; initialPoint?:TripLocationPoint|null; onClose:()=>void; onConfirm:(point:TripLocationPoint)=>void};
export function LocationPickerSheet({open,type,area,initialPoint=null,onClose,onConfirm}:Props) {
  const [point,setPoint] = useState<TripLocationPoint|null>(initialPoint);
  const [address,setAddress] = useState(initialPoint?.address ?? "");
  useEffect(() => { if (!open) return; const p = initialPoint ?? (area ? { ...area.center, address: `${area.name}, Argentina`, locality:area.name } : null); setPoint(p); setAddress(p?.address ?? ""); }, [open,area,initialPoint]);
  const select = (lat:number,lng:number) => { if (!area) return; const p={lat,lng,address:address.trim() || `${area.name}, Argentina`,locality:area.name}; setPoint(p); };
  const confirm = () => { if (!area || !point) return; onConfirm({...point,address:address.trim() || `${area.name}, Argentina`,locality:area.name}); };
  return <BottomSheet open={open} onClose={onClose} title={type==="origin"?"Seleccioná el punto de origen":"Seleccioná el punto de destino"} tall>
    {!area ? <p className="text-[13px] text-[#6B6A66]">Primero seleccioná una zona.</p> : <div className="flex min-h-full flex-col">
      <p className="mb-2 text-[13px] text-[#6B6A66]">Tocá el mapa para elegir una ubicación de ejemplo.</p>
      <p className="mb-3 text-[12px] font-semibold text-[#0F6E56]">Zona seleccionada: {area.name}</p>
      <div className="relative h-[390px] overflow-hidden rounded-[18px]"><DemoIllustratedMap className="h-full w-full" center={point ?? area.center} onPick={p=>select(p.lat,p.lng)} /><MapPin className="pointer-events-none absolute left-1/2 top-1/2 hidden text-[#1D9E75]" /></div>
      <div className="mt-4 rounded-[14px] border border-[#E5E4DF] bg-white p-3"><label className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#111110]" htmlFor="demo-location-address"><Search className="h-4 w-4 text-[#0F6E56]"/>Dirección</label><input id="demo-location-address" className="w-full rounded-lg border border-[#E5E4DF] p-3 text-[13px]" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Calle y número (demostrativo)"/><p className="mt-2 text-[11px] text-[#8A8984]">La dirección es ilustrativa; no se valida con servicios externos.</p></div>
      <div className="mt-3 rounded-[14px] border border-[#E5E4DF] bg-[#F8F7F4] p-4"><p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A8984]">Ubicación seleccionada</p><p className="mt-1 text-[14px] font-semibold text-[#111110]">{address || `${area.name}, Argentina`}</p>{point && <p className="mt-1 text-[11px] text-[#8A8984]">{point.lat.toFixed(6)} · {point.lng.toFixed(6)}</p>}</div>
      <div className="mt-5 space-y-2"><button type="button" onClick={confirm} disabled={!point} className="wayco-btn wayco-btn-primary disabled:opacity-40">Confirmar ubicación</button><button type="button" onClick={onClose} className="wayco-btn wayco-btn-secondary">Volver</button></div>
    </div>}
  </BottomSheet>;
}
