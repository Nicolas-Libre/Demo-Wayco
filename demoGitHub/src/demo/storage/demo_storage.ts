/** Datos de demostración aislados por navegador y por origen. */
export type DemoTrip = {
  id: string;
  origin: string;
  destination: string;
  departureAt: string;
  seatsTotal: number;
  seatsAvailable: number;
  driverId?: string;
  driverName?: string;
  pricePerSeat?: number;
};

export type DemoReservation = {
  id: string;
  tripId: string;
  seats: number;
  createdAt: string;
  status?: "pendiente" | "confirmada" | "rechazada" | "cancelada";
  passengerId?: string;
  passengerName?: string;
};

export type DemoState = {
  version: 1;
  trips: DemoTrip[];
  reservations: DemoReservation[];
  conductorRequestsSeeded?: string[];
};

const STORAGE_KEY = "wayco_demo_v1";
// Los datos de viajes se conservan durante 48 horas después de su finalización.
// En la demo, la llegada estimada es 35 minutos después de la salida,
// y el viaje finaliza 2 horas después de esa llegada.
const ESTIMATED_TRAVEL_MS = 35 * 60 * 1000;
const AFTER_ARRIVAL_MS = 2 * 60 * 60 * 1000;
const RETENTION_MS = 48 * 60 * 60 * 1000;

function tripExpiryTime(trip: DemoTrip): number {
  const departure = new Date(trip.departureAt).getTime();
  return departure + ESTIMATED_TRAVEL_MS + AFTER_ARRIVAL_MS + RETENTION_MS;
}

function purgeExpired(state: DemoState): boolean {
  const now = Date.now();
  const before = state.trips.length;
  state.trips = state.trips.filter(trip => {
    const expiry = tripExpiryTime(trip);
    // No eliminar datos cuya fecha sea inválida: evitar pérdida accidental.
    return !Number.isFinite(expiry) || expiry > now;
  });
  const retainedTripIds = new Set(state.trips.map(t => t.id));
  const beforeReservations = state.reservations.length;
  state.reservations = state.reservations.filter(r => retainedTripIds.has(r.tripId));
  return state.trips.length !== before || state.reservations.length !== beforeReservations;
}
export const DEMO_USER_ID = "11111111-1111-4111-8111-111111111111";
export const MARTINA_USER_ID = "demo-driver-0";
const ACTIVE_USER_KEY = "wayco_demo_active_user_v1";
export function activeDemoUserId(): string { return window.localStorage.getItem(ACTIVE_USER_KEY) === MARTINA_USER_ID ? MARTINA_USER_ID : DEMO_USER_ID; }
export function switchDemoUser(id: string): void {
  if (id !== DEMO_USER_ID && id !== MARTINA_USER_ID) throw new Error("Usuario de demo inválido");
  window.localStorage.setItem(ACTIVE_USER_KEY, id);
  window.dispatchEvent(new Event("wayco-demo-changed"));
}
const SAMPLE_DRIVERS = ["Martina López", "Lucas Fernández", "Sofía Rodríguez", "Valentina Pérez"];
const initialTrips = (): DemoTrip[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const afterTomorrow = new Date();
  afterTomorrow.setDate(afterTomorrow.getDate() + 2);
  const dateAt = (date: Date, time: string) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${time}:00`;
  return [
    { id: "demo-trip-today-laplata-caba", origin: "La Plata", destination: "CABA", departureAt: dateAt(new Date(), "21:00"), seatsTotal: 3, seatsAvailable: 3 },
    { id: "demo-trip-laplata-caba", origin: "La Plata", destination: "Buenos Aires", departureAt: dateAt(tomorrow, "09:00"), seatsTotal: 3, seatsAvailable: 3 },
    { id: "demo-trip-caba-laplata", origin: "Buenos Aires", destination: "La Plata", departureAt: dateAt(tomorrow, "18:30"), seatsTotal: 2, seatsAvailable: 2 },
    { id: "demo-trip-laplata-berisso", origin: "La Plata", destination: "Berisso", departureAt: dateAt(afterTomorrow, "14:00"), seatsTotal: 4, seatsAvailable: 4 },
  ];
};
const emptyState = (): DemoState => ({ version: 1, trips: initialTrips(), reservations: [] });

export function loadDemoState(): DemoState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = emptyState();
    purgeExpired(initial);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" || parsed === null ||
      !("version" in parsed) || parsed.version !== 1 ||
      !("trips" in parsed) || !Array.isArray(parsed.trips) ||
      !("reservations" in parsed) || !Array.isArray(parsed.reservations)
    ) {
      const initial = emptyState();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const existing = parsed as DemoState;
    let migrated = purgeExpired(existing);
    existing.trips.forEach((trip, index) => {
      if (!trip.driverId) {
        trip.driverId = trip.id.startsWith("demo-trip-") ? `demo-driver-${index % SAMPLE_DRIVERS.length}` : DEMO_USER_ID;
        migrated = true;
      }
      if (!trip.driverName) {
        trip.driverName = trip.driverId === DEMO_USER_ID ? "Usuario Demo" : SAMPLE_DRIVERS[index % SAMPLE_DRIVERS.length];
        migrated = true;
      }
      if (!trip.pricePerSeat) { trip.pricePerSeat = 2500; migrated = true; }
    });
    // Migración: eliminar únicamente solicitudes ficticias pendientes de la etapa 13.
    // Las decisiones ya tomadas se conservan como historial de prueba.
    for (const reservation of [...existing.reservations]) {
      if (reservation.passengerId !== "demo-passenger-martina" || reservation.status !== "pendiente") continue;
      const trip = existing.trips.find(t => t.id === reservation.tripId);
      if (trip) trip.seatsAvailable = Math.min(trip.seatsTotal, trip.seatsAvailable + reservation.seats);
      existing.reservations.splice(existing.reservations.indexOf(reservation), 1);
      migrated = true;
    }
    if (migrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return existing;
  } catch {
    const initial = emptyState();
    purgeExpired(initial);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function saveDemoState(state: DemoState): void {
  purgeExpired(state);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("wayco-demo-changed"));
}

export function resetDemoState(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("wayco-demo-changed"));
}

export function addDemoTrip(input: Omit<DemoTrip, "id" | "seatsAvailable">): DemoTrip {
  if (!Number.isInteger(input.seatsTotal) || input.seatsTotal < 1) {
    throw new Error("La cantidad de asientos debe ser positiva.");
  }
  const state = loadDemoState();
  const trip: DemoTrip = { ...input, id: crypto.randomUUID(), seatsAvailable: input.seatsTotal, driverId: activeDemoUserId(), driverName: activeDemoUserId() === MARTINA_USER_ID ? "Martina López" : "Usuario Demo" };
  state.trips.push(trip);
  saveDemoState(state);
  return trip;
}

export function reserveDemoSeat(tripId: string): DemoReservation {
  const state = loadDemoState();
  const trip = state.trips.find((item) => item.id === tripId);
  if (!trip) throw new Error("No se encontró el viaje de demostración.");
  if (trip.driverId === activeDemoUserId()) throw new Error("No podés reservar tu propio viaje.");
  if (state.reservations.some(r => r.tripId === tripId && (r.passengerId ?? DEMO_USER_ID) === activeDemoUserId() && !["rechazada", "cancelada"].includes(r.status ?? "confirmada"))) throw new Error("Ya tenés una reserva en este viaje.");
  if (trip.seatsAvailable < 1) throw new Error("No quedan asientos disponibles.");
  trip.seatsAvailable -= 1;
  const reservation: DemoReservation = {
    id: crypto.randomUUID(), tripId, seats: 1, createdAt: new Date().toISOString(), status: "pendiente", passengerId: activeDemoUserId(), passengerName: activeDemoUserId() === MARTINA_USER_ID ? "Martina López" : "Usuario Demo",
  };
  state.reservations.push(reservation);
  saveDemoState(state);
  return reservation;
}

export function cancelDemoReservation(reservationId: string): void {
  const state = loadDemoState();
  const index = state.reservations.findIndex((item) => item.id === reservationId);
  if (index < 0) throw new Error("No se encontró la reserva.");
  const reservation = state.reservations[index];
  if ((reservation.passengerId ?? DEMO_USER_ID) !== activeDemoUserId()) throw new Error("No podés cancelar una reserva de otro usuario.");
  if (reservation.status === "rechazada" || reservation.status === "cancelada") throw new Error("La reserva ya no está activa.");
  state.reservations.splice(index, 1);
  const trip = state.trips.find((item) => item.id === reservation.tripId);
  if (trip) trip.seatsAvailable = Math.min(trip.seatsTotal, trip.seatsAvailable + reservation.seats);
  saveDemoState(state);
}

/** Sólo el conductor del viaje puede aceptar o rechazar una solicitud pendiente. */
export function decideDemoReservation(reservationId: string, decision: "confirmada" | "rechazada"): DemoReservation {
  const state = loadDemoState();
  const reservation = state.reservations.find(r => r.id === reservationId);
  if (!reservation) throw new Error("Solicitud no encontrada.");
  const trip = state.trips.find(t => t.id === reservation.tripId);
  if (!trip || trip.driverId !== activeDemoUserId()) throw new Error("No sos el conductor de este viaje.");
  if (reservation.status !== "pendiente") throw new Error("La solicitud ya fue respondida.");
  reservation.status = decision;
  if (decision === "rechazada") trip.seatsAvailable = Math.min(trip.seatsTotal, trip.seatsAvailable + reservation.seats);
  saveDemoState(state);
  return reservation;
}
