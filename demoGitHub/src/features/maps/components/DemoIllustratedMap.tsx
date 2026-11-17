import type { TripLocationPoint } from "@wayco/shared/trips";

type Point = Pick<TripLocationPoint, "lat" | "lng">;
type Props = { origin?: Point | null; destination?: Point | null; center?: Point | null; onPick?: (point: Point) => void; className?: string };

/** Mapa esquemático 100% local: no tiles, geolocalización ni servicios de terceros. */
export function DemoIllustratedMap({ origin, destination, center, onPick, className = "" }: Props) {
  const focus = center ?? origin ?? destination ?? { lat: -34.9214, lng: -57.9544 };
  const points = [origin, destination].filter((p): p is Point => Boolean(p));
  const minLat = points.length > 1 ? Math.min(...points.map(p => p.lat)) : focus.lat - 0.025;
  const maxLat = points.length > 1 ? Math.max(...points.map(p => p.lat)) : focus.lat + 0.025;
  const minLng = points.length > 1 ? Math.min(...points.map(p => p.lng)) : focus.lng - 0.035;
  const maxLng = points.length > 1 ? Math.max(...points.map(p => p.lng)) : focus.lng + 0.035;
  const latSpan = Math.max(maxLat - minLat, 0.025) * 1.4;
  const lngSpan = Math.max(maxLng - minLng, 0.035) * 1.4;
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const project = (p: Point) => ({ x: 50 + (p.lng - midLng) / lngSpan * 78, y: 50 - (p.lat - midLat) / latSpan * 78 });
  const a = origin && project(origin);
  const b = destination && project(destination);
  const marker = center && project(center);
  return <div className={`relative overflow-hidden bg-[#F2F1ED] ${className}`}>
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label="Mapa ilustrativo sin conexión a servicios externos">
      <rect width="100" height="100" fill="#F2F1ED" />
      <path d="M0 25 Q35 8 100 40 L100 53 Q45 22 0 40Z" fill="#D8E9E2" />
      <path d="M0 78 Q45 58 100 87 L100 100 L0 100Z" fill="#E0E9D7" />
      {Array.from({length: 10}, (_, i) => <g key={i} stroke="#FFFFFF" strokeWidth="1.3"><path d={`M${i*12-8} 0 L${i*12+17} 100`}/><path d={`M0 ${i*12-8} L100 ${i*12+17}`}/></g>)}
      {a && b && <path d={`M${a.x} ${a.y} Q${(a.x+b.x)/2+4} ${(a.y+b.y)/2-6} ${b.x} ${b.y}`} stroke="#1D9E75" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="2 1" />}
      {a && <circle cx={a.x} cy={a.y} r="2.5" fill="#1D9E75" stroke="white" strokeWidth="1" />}
      {b && <circle cx={b.x} cy={b.y} r="2.5" fill="#111110" stroke="white" strokeWidth="1" />}
      {marker && <circle cx={marker.x} cy={marker.y} r="2.5" fill="#1D9E75" stroke="white" strokeWidth="1" />}
    </svg>
    {onPick && <button type="button" aria-label="Elegir ubicación en mapa" className="absolute inset-0 h-full w-full cursor-crosshair" onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX-rect.left)/rect.width*100; const y = (e.clientY-rect.top)/rect.height*100; onPick({lat:midLat+(50-y)/78*latSpan,lng:midLng+(x-50)/78*lngSpan}); }} />}
    <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[10px] text-[#6B6A66]">Mapa ilustrativo · Demo</span>
  </div>;
}
