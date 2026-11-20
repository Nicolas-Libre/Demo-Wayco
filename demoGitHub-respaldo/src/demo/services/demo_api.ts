import { allDemoAddresses } from "../../features/maps/config/local_demo_addresses";
/** Codifica una línea ilustrativa de dos puntos en formato Google encoded polyline, sin conectarse a Google. */
function encodeDemoPolyline(points: {lat:number; lng:number}[]): string {
  let lastLat = 0, lastLng = 0, result = "";
  const encode = (number: number) => {
    let value = number < 0 ? ~(number << 1) : number << 1;
    while (value >= 0x20) { result += String.fromCharCode((0x20 | (value & 0x1f)) + 63); value >>= 5; }
    result += String.fromCharCode(value + 63);
  };
  for (const point of points) {
    const lat = Math.round(point.lat * 1e5), lng = Math.round(point.lng * 1e5);
    encode(lat - lastLat); encode(lng - lastLng); lastLat = lat; lastLng = lng;
  }
  return result;
}
import { addDemoTrip, cancelDemoReservation, loadDemoState, reserveDemoSeat, saveDemoState, decideDemoReservation, DEMO_USER_ID, MARTINA_USER_ID, activeDemoUserId } from "../storage/demo_storage";

const userId = "11111111-1111-4111-8111-111111111111";
const vehicleId = "22222222-2222-4222-8222-222222222222";
const defaultUser = { id: userId, name: "Usuario", surname: "Demo", email: "demo@wayco.example", phone: null, photoUrl: null, averageRating: 4.9, totalTrips: 12, cbuAlias: null, createdAt: "2026-01-01T00:00:00.000Z" };
const vehicle = { id: vehicleId, brand: "Toyota", model: "Etios", year: 2022, licensePlate: "DEMO123", fuelType: "Nafta", consumptionL100Km: 7, validationState: "aprobado", rejectReason: null, disableReason: null, validatedAt: "2026-01-01T00:00:00.000Z", createdAt: "2026-01-01T00:00:00.000Z" };
const USER_KEY = "wayco_demo_user_v1";
const MARTINA_KEY = "wayco_demo_martina_v1";
const getUser = () => {
  if (activeDemoUserId() === MARTINA_USER_ID) { try { return { ...defaultUser, id: MARTINA_USER_ID, name: "Martina", surname: "López", email: "martina@wayco.example", cbuAlias: "martina.demo", ...JSON.parse(window.localStorage.getItem(MARTINA_KEY) || "{}") }; } catch { return { ...defaultUser, id: MARTINA_USER_ID, name: "Martina", surname: "López" }; } }
  try { return { ...defaultUser, ...JSON.parse(window.localStorage.getItem(USER_KEY) || "{}") }; }
  catch { return { ...defaultUser }; }
};
const driver = { name: "Usuario Demo", averageRating: 4.9, totalTrips: 12 };
type Trip = ReturnType<typeof loadDemoState>["trips"][number];
const locationParts = (label: string) => {
  const point = allDemoAddresses().find(p => p.address === label);
  return point ? { locality: point.locality, address: point.address } : { locality: label, address: null };
};
const present = (t: Trip) => ({ id: t.id, origin: locationParts(t.origin).locality, destination: locationParts(t.destination).locality, originAddress: locationParts(t.origin).address, destinationAddress: locationParts(t.destination).address, date: t.departureAt.slice(0, 10), departureTime: t.departureAt.slice(11, 16), pricePerSeat: t.pricePerSeat ?? 2500, availableSeats: t.seatsAvailable, totalSeats: t.seatsTotal, vehicleDescription: "Toyota Etios", driver: { ...driver, name: t.driverName ?? "Usuario Demo" } });
/** Coordenadas locales de referencia para los recorridos de la demo. */
const demoCityCoordinates = [
  { names: ["la plata"], lat: -34.9214, lng: -57.9544 },
  { names: ["buenos aires", "caba", "capital federal"], lat: -34.6037, lng: -58.3816 },
  { names: ["berisso"], lat: -34.8735, lng: -57.8831 },
  { names: ["ensenada"], lat: -34.8629, lng: -57.9115 },
];
function demoCoordinate(location: string, fallback: { lat: number; lng: number }) {
  const normalized = location.toLocaleLowerCase("es-AR");
  const match = demoCityCoordinates.find(city => city.names.some(name => normalized.includes(name)));
  return match ? { lat: match.lat, lng: match.lng } : fallback;
}
const reservationView = (r: ReturnType<typeof loadDemoState>["reservations"][number]) => { const trip = loadDemoState().trips.find(t => t.id === r.tripId); return { id: r.id, seats: r.seats, status: r.status ?? "confirmada", trip: trip ? { ...present(trip), status: "activo" } : null }; };

/** Operaciones 100% locales. Las rutas no reconocidas fallan cerradas. */
export async function demoApi(path: string, method: string, body: unknown): Promise<unknown> {
  const url = new URL(path, "https://demo.invalid");
  const p = url.pathname;
  const data = (body ?? {}) as Record<string, unknown>;
  const state = loadDemoState();
  if (method === "POST" && p === "/api/maps/dynamic-map/reserve") return { allowed: true, current_count: 0, max_count: 100, warning_reached: false };
  if (method === "POST" && p === "/api/maps/geocode") {
    const address = String(data.address ?? "");
    const known = [{ key: "la plata", lat: -34.9214, lng: -57.9544 }, { key: "buenos aires", lat: -34.6037, lng: -58.3816 }, { key: "berisso", lat: -34.8735, lng: -57.8831 }, { key: "ensenada", lat: -34.8629, lng: -57.9115 }];
    const found = known.find(x => address.toLowerCase().includes(x.key));
    const point = found ?? { lat: -34.9214, lng: -57.9544 };
    return { lat: point.lat, lng: point.lng, address, locality: found?.key ?? address };
  }
  if (method === "POST" && p === "/api/maps/reverse-geocode") return { lat: Number(data.lat), lng: Number(data.lng), address: "Ubicación de demostración", locality: "Demo" };
  if (method === "POST" && p === "/api/maps/route") {
    const origin = data.origin as { lat: number; lng: number };
    const destination = data.destination as { lat: number; lng: number };
    if (!origin || !destination) throw new Error("Seleccioná origen y destino");
    const radians = (n: number) => n * Math.PI / 180;
    const a = Math.sin(radians(destination.lat - origin.lat) / 2) ** 2 + Math.cos(radians(origin.lat)) * Math.cos(radians(destination.lat)) * Math.sin(radians(destination.lng - origin.lng) / 2) ** 2;
    const distanceMeters = Math.max(1000, Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.3));
    return { distanceMeters, durationSeconds: Math.max(300, Math.round(distanceMeters / 12)), polyline: encodeDemoPolyline([origin, destination]), tollCost: 0,
      signedRoute: { payload: { userId: activeDemoUserId(), origin, destination, distanceMeters, durationSeconds: Math.max(300, Math.round(distanceMeters / 12)), polyline: encodeDemoPolyline([origin, destination]), tollCost: 0, expiresAt: Date.now() + 60 * 60 * 1000 }, signature: "a".repeat(64) } };
  }
  if (method === "GET" && p === "/api/users/me") return getUser();
  if (method === "PATCH" && p === "/api/users/me") {
    const updated = { ...getUser(), ...data, id: activeDemoUserId() };
    window.localStorage.setItem(activeDemoUserId() === MARTINA_USER_ID ? MARTINA_KEY : USER_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("wayco-demo-changed"));
    return updated;
  }
  if (method === "POST" && p === "/api/trips/price-preview") {
    const route = (data.route ?? {}) as Record<string, unknown>;
    const distanceKm = Math.max(1, Number(route.distanceKm ?? (Number(route.distanceMeters ?? 25000) / 1000)) || 25);
    const durationMinutes = Math.max(5, Number(route.durationMinutes ?? (Number(route.durationSeconds ?? 2400) / 60)) || 40);
    const tollCost = Math.max(0, Number(route.tollCost ?? 0) || 0);
    const passengerCount = Math.max(1, Number(data.passengerCount ?? 1) || 1);
    const fuelCost = Math.round(distanceKm * 110);
    const totalWearCost = Math.round(distanceKm * 24);
    const totalTripCost = fuelCost + tollCost + totalWearCost;
    const sharedFuelAndTollCost = Math.round((fuelCost + tollCost) / (passengerCount + 1));
    const passengerWearCost = Math.round(totalWearCost / passengerCount);
    const suggestedPricePerPassenger = Math.max(500, Math.round((sharedFuelAndTollCost + passengerWearCost) / 100) * 100);
    return {
      route: { distanceKm: Math.round(distanceKm * 10) / 10, durationMinutes: Math.round(durationMinutes), tollCost, description: "Recorrido ilustrativo (demo)" },
      pricing: { adjustedConsumptionL100Km: 7, fuelCost, tollCost, totalWearCost, totalTripCost,
        sharedFuelAndTollCost, passengerWearCost, suggestedPricePerPassenger,
        minimumPricePerPassenger: Math.round(suggestedPricePerPassenger * 0.8 / 100) * 100,
        maximumPricePerPassenger: Math.round(suggestedPricePerPassenger * 1.2 / 100) * 100,
        driverSharedCost: sharedFuelAndTollCost },
    };
  }
  // Reputación de demostración: datos ilustrativos por usuario.
  if (method === "GET" && p === "/api/users/me/reputation") {
    const mine = state.trips.filter(t => t.driverId === activeDemoUserId()).length;
    const passenger = state.reservations.filter(r => r.passengerId === activeDemoUserId() && r.status === "confirmada").length;
    return { driverRating: mine ? 4.9 : null, passengerRating: passenger ? 4.8 : null, driverTrips: mine, passengerTrips: passenger, credits: 0 };
  }
  // Historial y estado de finalización: no se inventan viajes finalizados.
  if (method === "GET" && p === "/api/trips/history") return { driver: [], passenger: [] };
  const completionMatch = p.match(/^\/api\/trips\/([^/]+)\/completion$/);
  if (method === "GET" && completionMatch) {
    const trip = state.trips.find(t => t.id === decodeURIComponent(completionMatch[1]));
    if (!trip) throw new Error("Viaje no encontrado.");
    const confirmed = state.reservations.filter(r => r.tripId === trip.id && r.status === "confirmada");
    const departure = new Date(trip.departureAt).getTime();
    const now = Date.now();
    return {
      tripId: trip.id, status: "activo", origin: trip.origin, destination: trip.destination,
      date: trip.departureAt.slice(0, 10), departureTime: trip.departureAt.slice(11, 16),
      departurePassed: now >= departure,
      hasPendingReservations: state.reservations.some(r => r.tripId === trip.id && r.status === "pendiente"),
      confirmedPassengers: confirmed.length, completedRatings: 0, requiredRatings: confirmed.length,
      finalizedAt: null, estimatedArrivalAt: new Date(departure + 35 * 60000).toISOString(),
      ratingDeadline: new Date(departure + 155 * 60000).toISOString(),
      ratingPeriodStarted: false, ratingPeriodExpired: false, ratingPeriodOpen: false,
      isDriver: trip.driverId === activeDemoUserId(), targets: [],
    };
  }
  if (method === "GET" && p === "/api/users/me/capabilities") return { isAdministrative: false };
  if (method === "GET" && p === "/api/vehicles/me") return [vehicle];
  if (method === "GET" && p === "/api/trips/today") return state.trips.filter(t => t.departureAt.slice(0, 10) === new Date().toLocaleDateString("en-CA")).map(present);
  if (method === "GET" && p === "/api/trips/search") {
    const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const origin = normalize(url.searchParams.get("origin") ?? "");
    const destination = normalize(url.searchParams.get("destination") ?? "");
    const date = url.searchParams.get("date");
    return state.trips.filter(t => t.driverId !== activeDemoUserId()
      && t.seatsAvailable > 0
      && new Date(t.departureAt).getTime() > Date.now()
      && (!origin || normalize(t.origin) === origin)
      && (!destination || normalize(t.destination) === destination)
      && (!date || t.departureAt.startsWith(date))).map(present);
  }
  if (method === "GET" && p === "/api/trips/me") return state.trips.filter(t => t.driverId === activeDemoUserId()).map(t => ({ ...present(t), status: "activo", reservations: state.reservations.filter(r => r.tripId === t.id).map(r => ({ id: r.id, passengerId: r.passengerId ?? userId, seats: r.seats, status: r.status ?? "confirmada", passenger: { name: r.passengerName ?? "Usuario Demo" } })) }));
  if (method === "POST" && p === "/api/trips") { const t = addDemoTrip({ origin: String((data.originPoint as {address?: string} | undefined)?.address ?? data.origin ?? ""), destination: String((data.destinationPoint as {address?: string} | undefined)?.address ?? data.destination ?? ""), departureAt: `${String(data.date)}T${String(data.departureTime)}:00`, seatsTotal: Number(data.totalSeats ?? 1), pricePerSeat: Number(data.selectedPricePerSeat ?? 2500) }); return { id: t.id }; }
  const detail = p.match(/^\/api\/trips\/([^/]+)$/);
  if (method === "GET" && detail) { const t = state.trips.find(x => x.id === decodeURIComponent(detail[1])); if (!t) throw new Error("Viaje no encontrado"); return { ...present(t), driverId: t.driverId ?? userId, vehicleId, notes: null, status: "activo", driver: { ...driver, name: t.driverName ?? "Usuario Demo", cbuAlias: t.driverId === activeDemoUserId() ? getUser().cbuAlias : "conductor.demo", createdAt: getUser().createdAt }, route: { distanceKm: 20, durationMinutes: 35, tollCost: 0, description: "Recorrido ilustrativo", polyline: encodeDemoPolyline([demoCoordinate(t.origin, { lat: -34.9214, lng: -57.9544 }), demoCoordinate(t.destination, { lat: -34.6037, lng: -58.3816 })]) }, pricing: { adjustedConsumptionL100Km: 7, fuelCost: 0, tollCost: 0, totalWearCost: 0, totalTripCost: 0, sharedFuelAndTollCost: 0, passengerWearCost: 0, suggestedPricePerPassenger: 2500, minimumPricePerPassenger: 2000, maximumPricePerPassenger: 3000, driverSharedCost: 0 } }; }
  if (method === "PATCH" && /^\/api\/trips\/[^/]+\/cancel$/.test(p)) {
    const id = decodeURIComponent(p.split("/")[3]);
    const trip = state.trips.find(t => t.id === id);
    if (!trip) throw new Error("Viaje no encontrado.");
    if (trip.driverId !== activeDemoUserId()) throw new Error("Solo el conductor puede cancelar su viaje.");
    state.trips = state.trips.filter(t => t.id !== id);
    state.reservations = state.reservations.filter(r => r.tripId !== id);
    saveDemoState(state);
    return { id, status: "cancelado" };
  }
  if (method === "POST" && p === "/api/reservations") { const seats = Number(data.seats ?? 1); if (!Number.isInteger(seats) || seats !== 1) throw new Error("Esta etapa permite reservar un asiento por operación"); const r = reserveDemoSeat(String(data.tripId)); return { id: r.id, seats: r.seats, status: r.status ?? "pendiente" }; }
  if (method === "GET" && p === "/api/reservations/me") return state.reservations.filter(r => (r.passengerId ?? DEMO_USER_ID) === activeDemoUserId()).map(reservationView);
  const byTrip = p.match(/^\/api\/reservations\/me\/by-trip\/([^/]+)$/);
  if (method === "GET" && byTrip) {
    const tripId = decodeURIComponent(byTrip[1]);
    const reservation = state.reservations.find(r => r.tripId === tripId && (r.passengerId ?? DEMO_USER_ID) === activeDemoUserId() && r.status !== "rechazada" && r.status !== "cancelada");
    return reservation ? { id: reservation.id, tripId: reservation.tripId, seats: reservation.seats, status: reservation.status ?? "confirmada" } : null;
  }
  if (method === "GET" && p === "/api/reservations/me/upcoming") return state.reservations.filter(r => (r.passengerId ?? DEMO_USER_ID) === activeDemoUserId()).map(r => {
    const trip = state.trips.find(t => t.id === r.tripId);
    return trip ? { id: r.id, seats: r.seats, status: r.status ?? "confirmada", trip: {
      id: trip.id, origin: trip.origin, destination: trip.destination,
      date: trip.departureAt.slice(0, 10), departureTime: trip.departureAt.slice(11, 16)
    }} : null;
  }).filter((r): r is NonNullable<typeof r> => r !== null && r.trip.date >= new Date().toLocaleDateString("en-CA"));
  if (method === "PATCH" && /^\/api\/reservations\/[^/]+\/decision$/.test(p)) {
    const id = decodeURIComponent(p.split("/")[3]);
    const decision = String(data.status);
    if (decision !== "confirmada" && decision !== "rechazada") throw new Error("Decisión inválida.");
    const reservation = decideDemoReservation(id, decision);
    return { id: reservation.id, status: reservation.status, seats: reservation.seats };
  }
  if (method === "PATCH" && /^\/api\/reservations\/[^/]+\/cancel$/.test(p)) {
    const id = decodeURIComponent(p.split("/")[3]);
    const reservation = state.reservations.find(r => r.id === id);
    if (!reservation || (reservation.passengerId ?? DEMO_USER_ID) !== activeDemoUserId()) {
      throw new Error("No podés cancelar una reserva de otro usuario.");
    }
    if (reservation.status === "rechazada" || reservation.status === "cancelada") {
      throw new Error("La reserva ya no está activa.");
    }
    cancelDemoReservation(id);
    return { id, seats: reservation.seats, status: "cancelada" };
  }
  throw new Error(`La operación ${method} ${p} todavía no está simulada. No se realizó ninguna solicitud externa.`);
}
