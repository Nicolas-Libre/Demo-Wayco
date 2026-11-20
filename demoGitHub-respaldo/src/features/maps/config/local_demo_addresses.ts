import type { TripLocationPoint } from "@wayco/shared/trips";

// Catálogo ilustrativo local. No consulta Google ni verifica domicilios reales.
const PLACES: Array<[string, string, number, number, string[]]> = [
  ["La Plata", "Plaza Moreno, La Plata", -34.9214, -57.9544, ["plaza moreno", "centro", "12 y 51"]],
  ["La Plata", "Plaza San Martín, La Plata", -34.9140, -57.9488, ["plaza san martin", "7 y 50"]],
  ["La Plata", "Estación de Trenes, La Plata", -34.9048, -57.9498, ["estacion", "1 y 44"]],
  ["La Plata", "Terminal de Ómnibus, La Plata", -34.9114, -57.9590, ["terminal", "4 y 42"]],
  ["La Plata", "Plaza Italia, La Plata", -34.9149, -57.9578, ["plaza italia", "7 y 44"]],
  ["La Plata", "Plaza Rocha, La Plata", -34.9220, -57.9440, ["plaza rocha", "7 y 60"]],
  ["La Plata", "Catedral de La Plata", -34.9226, -57.9563, ["catedral"]],
  ["La Plata", "Universidad Nacional de La Plata, Rectorado", -34.9127, -57.9511, ["unlp", "universidad"]],
  ["La Plata", "Hospital San Martín, La Plata", -34.9238, -57.9348, ["hospital san martin"]],
  ["La Plata", "Estadio Único, La Plata", -34.9130, -58.0185, ["estadio", "estadio unico"]],
  ["CABA", "Obelisco, CABA", -34.6037, -58.3816, ["obelisco", "9 de julio"]],
  ["CABA", "Plaza de Mayo, CABA", -34.6080, -58.3703, ["plaza de mayo", "casa rosada"]],
  ["CABA", "Estación Constitución, CABA", -34.6275, -58.3807, ["constitucion", "estacion constitucion"]],
  ["CABA", "Estación Retiro, CABA", -34.5916, -58.3747, ["retiro", "estacion retiro"]],
  ["CABA", "Plaza Italia, Palermo, CABA", -34.5815, -58.4205, ["plaza italia", "palermo"]],
  ["CABA", "Facultad de Derecho, CABA", -34.5830, -58.3911, ["facultad de derecho", "recoleta"]],
  ["CABA", "Parque Centenario, CABA", -34.6061, -58.4345, ["parque centenario", "caballito"]],
  ["CABA", "Congreso de la Nación, CABA", -34.6098, -58.3926, ["congreso"]],
  ["CABA", "Puerto Madero, CABA", -34.6115, -58.3632, ["puerto madero"]],
  ["CABA", "Aeroparque Jorge Newbery, CABA", -34.5592, -58.4156, ["aeroparque"]],
  ["Quilmes", "Estación Quilmes", -34.7240, -58.2530, ["estacion", "centro"]],
  ["Quilmes", "Plaza San Martín, Quilmes", -34.7203, -58.2545, ["plaza san martin"]],
  ["Berazategui", "Estación Berazategui", -34.7631, -58.2088, ["estacion"]],
  ["Florencio Varela", "Estación Florencio Varela", -34.8085, -58.2765, ["estacion"]],
  ["City Bell", "Estación City Bell", -34.8678, -58.0411, ["estacion"]],
  ["Gonnet", "Estación Gonnet", -34.8766, -58.0173, ["estacion"]],
  ["Berisso", "Plaza 17 de Octubre, Berisso", -34.8728, -57.8858, ["plaza 17 de octubre", "plaza", "centro"]],
  ["Berisso", "Municipalidad de Berisso", -34.8730, -57.8847, ["municipalidad", "centro"]],
  ["Ensenada", "Plaza Belgrano, Ensenada", -34.8652, -57.9100, ["plaza belgrano", "centro"]],
  ["Ensenada", "Municipalidad de Ensenada", -34.8648, -57.9114, ["municipalidad", "centro"]],
];

const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function searchDemoAddresses(query: string, areaName: string): TripLocationPoint[] {
  const q = normalize(query);
  if (!q) return [];
  return PLACES.filter(([area, label, , , aliases]) => normalize(area) === normalize(areaName) && [label, ...aliases].some(x => normalize(x).includes(q)))
    .slice(0, 8).map(([area, address, lat, lng]) => ({ address, lat, lng, locality: area }));
}
export function isCatalogPoint(point: TripLocationPoint, areaName: string): boolean {
  return PLACES.some(([area, address, lat, lng]) => normalize(area) === normalize(areaName) && address === point.address && lat === point.lat && lng === point.lng);
}

export function allDemoAddresses(): TripLocationPoint[] {
  return PLACES.map(([area, address, lat, lng]) => ({ address, lat, lng, locality: area }));
}
