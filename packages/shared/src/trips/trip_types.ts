export type TodayTripDriver = {
  name: string;
  averageRating: number;
  totalTrips: number;
};

export type TodayTrip = {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departureTime: string;
  pricePerSeat: number;
  availableSeats: number;
  totalSeats: number;
  vehicleDescription: string;
  driver: TodayTripDriver | null;
};

export type TripSearchParams = {
  origin: string;
  destination: string;

  originLat: number;
  originLng: number;

  destinationLat: number;
  destinationLng: number;

  date: string;
};

export type TripSearchDriver = {
  name: string;
  averageRating: number;
  totalTrips: number;
};

export type TripSearchResult = {
  id: string;
  origin: string;
  destination: string;
  originAddress: string | null;
  destinationAddress: string | null;
  date: string;
  departureTime: string;
  pricePerSeat: number;
  availableSeats: number;
  totalSeats: number;
  vehicleDescription: string;
  driver: TripSearchDriver | null;
};

/* =========================================================
 * TRIP DETAIL
 * ======================================================= */

export type TripDetailDriver = {
  name: string;
  averageRating: number | null;
  totalTrips: number | null;
  cbuAlias: string | null;
  createdAt: string | null;
};

export type TripDetailRoute = {
  distanceKm: number;
  durationMinutes: number;
  tollCost: number;
  description: string;
  polyline: string | null;
};

export type TripDetailPricing = {
  adjustedConsumptionL100Km: number;

  fuelCost: number;
  tollCost: number;
  totalWearCost: number;
  totalTripCost: number;

  sharedFuelAndTollCost: number;
  passengerWearCost: number;

  suggestedPricePerPassenger: number;
  minimumPricePerPassenger: number;
  maximumPricePerPassenger: number;

  driverSharedCost: number;
};

export type TripDetail = {
  id: string;

  driverId: string;
  vehicleId: string;

  origin: string;
  destination: string;

  originAddress: string | null;
  destinationAddress: string | null;

  date: string;
  departureTime: string;

  totalSeats: number;
  availableSeats: number;

  pricePerSeat: number;

  vehicleDescription: string;

  notes: string | null;
  status: string;

  driver: TripDetailDriver | null;

  route: TripDetailRoute;

  pricing: TripDetailPricing;
};

/* =========================================================
 * CREATE
 * ======================================================= */

export type CreatedTrip = {
  id: string;
};

/* =========================================================
 * PRICE PREVIEW
 * ======================================================= */

export type TripPricePreview = {
  route: {
    distanceKm: number;
    durationMinutes: number;
    tollCost: number;
    description: string;
  };

  pricing: TripDetailPricing;
};

/* =========================================================
 * MY PUBLISHED TRIPS
 * ======================================================= */

export type MyPublishedTripReservation = {
  id: string;
  passengerId: string;
  seats: number;

  status:
    | "pendiente"
    | "confirmada"
    | "cancelada"
    | "rechazada";

  passenger: {
    name: string;
  } | null;
};

export type MyPublishedTrip = {
  id: string;

  origin: string;
  destination: string;

  date: string;
  departureTime: string;

  availableSeats: number;
  totalSeats: number;

  status: string;

  reservations:
    MyPublishedTripReservation[];
};

export type CancelledTrip = {
  id: string;
  status: string;
};