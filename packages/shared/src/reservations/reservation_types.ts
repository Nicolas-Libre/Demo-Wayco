export const RESERVATION_STATUSES = [
  "pendiente",
  "confirmada",
  "cancelada",
  "rechazada",
] as const;

export type ReservationStatus =
  (typeof RESERVATION_STATUSES)[number];


/* =========================================================
 * UPCOMING
 * ======================================================= */

export type UpcomingReservationTrip = {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
};

export type UpcomingReservation = {
  id: string;
  seats: number;
  status: ReservationStatus;
  trip: UpcomingReservationTrip;
};


/* =========================================================
 * RESERVATION FOR TRIP
 * ======================================================= */

export type ReservationForTrip = {
  id: string;
  tripId: string;
  seats: number;
  status: ReservationStatus;
};


/* =========================================================
 * CREATE
 * ======================================================= */

export type CreateReservationInput = {
  tripId: string;
  seats: number;
};

export type CreatedReservation = {
  id: string;
  seats: number;
  status: ReservationStatus;
};


/* =========================================================
 * CANCEL
 * ======================================================= */

export type CancelledReservation = {
  id: string;
  seats: number;
  status: ReservationStatus;
};

/* =========================================================
 * MY RESERVATIONS
 * ======================================================= */

export type MyReservationDriver = {
  name: string;
};

export type MyReservationTrip = {
  id: string;

  origin: string;
  destination: string;

  date: string;
  departureTime: string;

  status: string;

  pricePerSeat: number;

  driver:
    MyReservationDriver | null;
};

export type MyReservation = {
  id: string;

  seats: number;

  status:
    ReservationStatus;

  trip:
    MyReservationTrip | null;
};


/* =========================================================
 * DRIVER RESERVATION MANAGEMENT
 * ======================================================= */

export type DriverReservationPassenger = {
  name: string;
};

export type DriverTripReservation = {
  id: string;

  seats: number;

  status:
    ReservationStatus;

  passenger:
    DriverReservationPassenger | null;
};

export type ReservationDecisionInput = {
  status:
    | "confirmada"
    | "rechazada";
};

export type UpdatedReservation = {
  id: string;

  seats: number;

  status:
    ReservationStatus;
};