import type { TripLocationPoint } from "@wayco/shared/trips";

/** Catálogo 100% local. Las coordenadas son aproximadas y demostrativas. */
export type DemoAddress = TripLocationPoint & { id: string; locality: string };

export const DEMO_ADDRESSES: DemoAddress[] = [
  { id: "lp-moreno", address: "Plaza Moreno, La Plata", locality: "La Plata", lat: -34.9214, lng: -57.9544 },
  { id: "lp-estacion", address: "Estación de Trenes, La Plata", locality: "La Plata", lat: -34.9046, lng: -57.9502 },
  { id: "lp-san-martin", address: "Plaza San Martín, La Plata", locality: "La Plata", lat: -34.9136, lng: -57.9495 },
  { id: "lp-paso", address: "Plaza Paso, La Plata", locality: "La Plata", lat: -34.9178, lng: -57.9673 },
  { id: "lp-rocha", address: "Plaza Rocha, La Plata", locality: "La Plata", lat: -34.9224, lng: -57.9427 },
  { id: "lp-islas-malvinas", address: "Plaza Islas Malvinas, La Plata", locality: "La Plata", lat: -34.9280, lng: -57.9690 },
  { id: "lp-republica", address: "República de los Niños, La Plata", locality: "La Plata", lat: -34.8617, lng: -58.0180 },
  { id: "lp-terminal", address: "Terminal de Ómnibus, La Plata", locality: "La Plata", lat: -34.9076, lng: -57.9587 },
  { id: "caba-obelisco", address: "Obelisco, CABA", locality: "CABA", lat: -34.6037, lng: -58.3816 },
  { id: "caba-constitucion", address: "Estación Constitución, CABA", locality: "CABA", lat: -34.6276, lng: -58.3817 },
  { id: "caba-retiro", address: "Estación Retiro, CABA", locality: "CABA", lat: -34.5917, lng: -58.3759 },
  { id: "caba-mayo", address: "Plaza de Mayo, CABA", locality: "CABA", lat: -34.6081, lng: -58.3702 },
  { id: "caba-congreso", address: "Plaza del Congreso, CABA", locality: "CABA", lat: -34.6097, lng: -58.3926 },
  { id: "caba-palermo", address: "Plaza Italia, CABA", locality: "CABA", lat: -34.5811, lng: -58.4200 },
  { id: "caba-aeroparque", address: "Aeroparque Jorge Newbery, CABA", locality: "CABA", lat: -34.5592, lng: -58.4156 },
  { id: "hudson-estacion", address: "Estación Hudson, Hudson", locality: "Hudson", lat: -34.7890, lng: -58.1450 },
  { id: "hudson-plaza", address: "Plaza de Hudson, Hudson", locality: "Hudson", lat: -34.7915, lng: -58.1395 },
  { id: "quilmes-estacion", address: "Estación Quilmes, Quilmes", locality: "Quilmes", lat: -34.7244, lng: -58.2523 },
  { id: "quilmes-plaza", address: "Plaza San Martín, Quilmes", locality: "Quilmes", lat: -34.7205, lng: -58.2544 },
  { id: "quilmes-costanera", address: "Costanera de Quilmes, Quilmes", locality: "Quilmes", lat: -34.7055, lng: -58.2220 },
  { id: "berazategui-estacion", address: "Estación Berazategui, Berazategui", locality: "Berazategui", lat: -34.7612, lng: -58.2093 },
  { id: "berazategui-plaza", address: "Plaza San Martín, Berazategui", locality: "Berazategui", lat: -34.7634, lng: -58.2113 },
  { id: "berazategui-centro", address: "Centro de Berazategui, Berazategui", locality: "Berazategui", lat: -34.7621, lng: -58.2130 },
];

export function normalizeDemoAddress(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es-AR").replace(/[^a-z0-9]+/g, " ").trim();
}

export function searchDemoAddresses(query: string, locality: string): DemoAddress[] {
  const q = normalizeDemoAddress(query);
  return DEMO_ADDRESSES.filter(item => item.locality === locality && (!q || normalizeDemoAddress(item.address).includes(q)));
}

export function findDemoAddress(value: string): DemoAddress | undefined {
  const normalized = normalizeDemoAddress(value);
  return DEMO_ADDRESSES.find(item => normalizeDemoAddress(item.address) === normalized);
}

export function findDemoAddressByCoordinates(lat: number, lng: number): DemoAddress | undefined {
  return DEMO_ADDRESSES.find(item => Math.abs(item.lat - lat) < 0.00001 && Math.abs(item.lng - lng) < 0.00001);
}
