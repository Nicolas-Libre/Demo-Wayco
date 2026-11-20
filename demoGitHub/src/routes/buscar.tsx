import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, MapPin, Star } from "lucide-react";

import type {
  TripLocationPoint,
  TripSearchParams,
  TripSearchResult,
} from "@wayco/shared/trips";

import { AuthShell } from "@/components/layout/AuthShell";
import { Avatar } from "@/components/data-display/UserAvatar";
import { TripCardSkeleton } from "@/features/trips/components/TripCardSkeleton";
import { TripRoute } from "@/features/trips/components/TripRoute";
import { use_search_trips } from "@/features/trips/hooks/use_search_trips";
import { GeoPermissionSheet } from "@/features/geolocation/components/GeoPermissionSheet";
import { BottomSheet } from "@/components/overlays/BottomSheet";
import { formatDecimal } from "@/features/trips/utils/trip-formatters";
import { AddressPickerSheet } from "@/features/maps/components/AddressPickerSheet";

import {
  WAYCO_AREAS,
  type WaycoArea,
} from "@/features/maps/config/wayco_areas";

/* =========================================================
 * ROUTE
 * ========================================================= */

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      {
        title: "Buscar viajes — Wayco",
      },
    ],
  }),

  component: () => (
    <AuthShell>
      <GeoPermissionSheet scope="buscar" />
      <BuscarPage />
    </AuthShell>
  ),
});

/* =========================================================
 * DATE HELPERS
 * ========================================================= */

function todayPlus(daysToAdd: number): Date {
  const date = new Date();

  date.setDate(date.getDate() + daysToAdd);

  return date;
}

function iso(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function labelDia(date: Date, index: number): string {
  if (index === 0) {
    return "Hoy";
  }

  if (index === 1) {
    return "Mañana";
  }

  const dias = [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
  ];

  return `${dias[date.getDay()]} ${date.getDate()}`;
}

/* =========================================================
 * SEARCH SESSION
 * ========================================================= */

const SEARCH_STORAGE_KEY = "wayco:buscar:last-search";

type SavedSearch = {
  originName: string | null;
  destinationName: string | null;
  originPoint: TripLocationPoint | null;
  destinationPoint: TripLocationPoint | null;
  date: string;
  searched: boolean;
};

function readSavedSearch(): SavedSearch | null {
  try {
    const raw = sessionStorage.getItem(SEARCH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const value: unknown = JSON.parse(raw);

    if (!value || typeof value !== "object") {
      return null;
    }

    const saved = value as Partial<SavedSearch>;

    if (
      typeof saved.date !== "string" ||
      typeof saved.searched !== "boolean" ||
      (saved.originName != null &&
        typeof saved.originName !== "string") ||
      (saved.destinationName != null &&
        typeof saved.destinationName !== "string")
    ) {
      return null;
    }

    const validPoint = (
      point: unknown,
    ): point is TripLocationPoint => {
      if (!point || typeof point !== "object") {
        return false;
      }

      const p = point as Partial<TripLocationPoint>;

      return (
        typeof p.lat === "number" &&
        Number.isFinite(p.lat) &&
        typeof p.lng === "number" &&
        Number.isFinite(p.lng) &&
        typeof p.address === "string"
      );
    };

    if (
      saved.originPoint != null &&
      !validPoint(saved.originPoint)
    ) {
      return null;
    }

    if (
      saved.destinationPoint != null &&
      !validPoint(saved.destinationPoint)
    ) {
      return null;
    }

    return {
      originName: saved.originName ?? null,
      destinationName: saved.destinationName ?? null,
      originPoint: saved.originPoint ?? null,
      destinationPoint: saved.destinationPoint ?? null,
      date: saved.date,
      searched: saved.searched,
    };
  } catch {
    return null;
  }
}

/* =========================================================
 * SEARCH PAGE
 * ========================================================= */

function BuscarPage() {
  const [savedSearch] = useState(readSavedSearch);

  /* =======================================================
   * GENERAL LOCATIONS
   * ======================================================= */

  const [origen, setOrigen] = useState<WaycoArea | null>(
    savedSearch?.originName
      ? WAYCO_AREAS.find(
          (area) => area.name === savedSearch.originName,
        ) ?? null
      : WAYCO_AREAS[0] ?? null,
  );

  const [destino, setDestino] = useState<WaycoArea | null>(
    savedSearch?.destinationName
      ? WAYCO_AREAS.find(
          (area) => area.name === savedSearch.destinationName,
        ) ?? null
      : WAYCO_AREAS[1] ?? null,
  );

  /* =======================================================
   * EXACT LOCATIONS
   * ======================================================= */

  const [originPoint, setOriginPoint] =
    useState<TripLocationPoint | null>(
      savedSearch?.originPoint ?? null,
    );

  const [destinationPoint, setDestinationPoint] =
    useState<TripLocationPoint | null>(
      savedSearch?.destinationPoint ?? null,
    );

  /* =======================================================
   * DATE
   * ======================================================= */

  const [fecha, setFecha] = useState<string>(
    savedSearch?.date ?? iso(new Date()),
  );

  const dias = useMemo(
    () =>
      Array.from(
        { length: 7 },
        (_, index) => todayPlus(index),
      ),
    [],
  );

  /* =======================================================
   * SEARCH STATE
   * ======================================================= */

  const [searched, setSearched] = useState(
    savedSearch?.searched ?? false,
  );

  const [locationSheet, setLocationSheet] = useState<
    "origen" | "destino" | null
  >(null);

  const [addressSheet, setAddressSheet] = useState<
    "origen" | "destino" | null
  >(null);

  /* =======================================================
   * PERSIST SEARCH
   * ======================================================= */

  useEffect(() => {
    const snapshot: SavedSearch = {
      originName: origen?.name ?? null,
      destinationName: destino?.name ?? null,
      originPoint,
      destinationPoint,
      date: fecha,
      searched,
    };

    try {
      sessionStorage.setItem(
        SEARCH_STORAGE_KEY,
        JSON.stringify(snapshot),
      );
    } catch {
      // Si sessionStorage no está disponible,
      // la búsqueda continúa funcionando en memoria.
    }
  }, [
    origen,
    destino,
    originPoint,
    destinationPoint,
    fecha,
    searched,
  ]);

  /* =======================================================
   * SEARCH PARAMETERS
   * ======================================================= */

  const searchInput = useMemo<
    TripSearchParams | null
  >(() => {
    if (
      !searched ||
      !origen ||
      !destino ||
      !originPoint ||
      !destinationPoint ||
      !fecha
    ) {
      return null;
    }

    return {
      origin: origen.name,
      destination: destino.name,

      originLat: originPoint.lat,
      originLng: originPoint.lng,

      destinationLat: destinationPoint.lat,
      destinationLng: destinationPoint.lng,

      date: fecha,
    };
  }, [
    searched,
    origen,
    destino,
    originPoint,
    destinationPoint,
    fecha,
  ]);

  /* =======================================================
   * QUERY
   * ======================================================= */

  const trips_query = use_search_trips({
    input: searchInput,
    enabled: searched,
  });

  const viajes = trips_query.data ?? [];

  const loading =
    trips_query.isPending && searched;

  /* =======================================================
   * VALIDATIONS
   * ======================================================= */

  const puedeBuscar = Boolean(
    origen &&
      destino &&
      originPoint &&
      destinationPoint &&
      fecha,
  );

  /* =======================================================
   * HANDLERS
   * ======================================================= */

  function handleSearch() {
    if (!puedeBuscar) {
      return;
    }

    setSearched(true);
  }

  function handleResetSearch() {
    setSearched(false);
  }

  function handleSelectArea(area: WaycoArea) {
    const target = locationSheet;

    if (!target) {
      return;
    }

    if (target === "origen") {
      const changed = origen?.name !== area.name;

      setOrigen(area);

      if (changed) {
        setOriginPoint(null);
      }
    }

    if (target === "destino") {
      const changed = destino?.name !== area.name;

      setDestino(area);

      if (changed) {
        setDestinationPoint(null);
      }
    }

    setLocationSheet(null);

    setAddressSheet(target);
  }

  function handleConfirmAddress(
    point: TripLocationPoint,
  ) {
    if (addressSheet === "origen") {
      setOriginPoint(point);
    }

    if (addressSheet === "destino") {
      setDestinationPoint(point);
    }

    setAddressSheet(null);
  }

  /* =======================================================
   * RENDER
   * ======================================================= */

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#F7F7F5",
      }}
    >
      <div className="px-5 pb-32 pt-6">
        {!searched ? (
          <>
            {/* ============================================
             * HEADER
             * ============================================ */}

            <div className="mb-6">
              <h1
                className="text-[22px] font-bold"
                style={{
                  color: "#111110",
                }}
              >
                ¿A dónde vas?
              </h1>

              <p
                className="mt-1 text-[14px]"
                style={{
                  color: "#6B6A66",
                }}
              >
                Elegí tu origen, destino y fecha.
              </p>
            </div>

            {/* ============================================
             * LOCATIONS
             * ============================================ */}

            <div
              className="rounded-[18px] p-4"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E7E3",
              }}
            >
              {/* ORIGIN */}

              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B6A66]">
                  Origen
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setLocationSheet("origen")
                  }
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#E8F5F0]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1D9E75]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[#8A8984]">
                      Localidad de origen
                    </p>

                    <p
                      className={`mt-0.5 truncate text-[14px] font-semibold ${
                        origen
                          ? "text-[#111110]"
                          : "text-[#9B9A96]"
                      }`}
                    >
                      {origen?.name ??
                        "Seleccioná una localidad"}
                    </p>
                  </div>

                  <ChevronDown
                    size={17}
                    className="shrink-0 text-[#6B6A66]"
                  />
                </button>

                {/* EXACT ORIGIN ADDRESS */}

                <button
                  type="button"
                  onClick={() =>
                    setAddressSheet("origen")
                  }
                  disabled={!origen}
                  className="mt-3 flex w-full items-center gap-3 rounded-[12px] border border-[#E8E7E3] bg-[#F8F7F4] px-3 py-3 text-left disabled:opacity-50"
                >
                  <MapPin
                    size={17}
                    className="shrink-0 text-[#1D9E75]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[#8A8984]">
                      Dirección exacta
                    </p>

                    <p
                      className={`mt-0.5 text-[13px] ${
                        originPoint
                          ? "font-medium text-[#111110]"
                          : "text-[#9B9A96]"
                      }`}
                    >
                      {originPoint?.address ??
                        "Seleccioná una dirección"}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className="shrink-0 text-[#6B6A66]"
                  />
                </button>
              </div>

              {/* DIVIDER */}

              <div className="my-5 border-t border-[#E8E7E3]" />

              {/* DESTINATION */}

              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B6A66]">
                  Destino
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setLocationSheet("destino")
                  }
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#F2F1ED]">
                    <span className="h-2.5 w-2.5 rounded-[2px] bg-[#111110]" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[#8A8984]">
                      Localidad de destino
                    </p>

                    <p
                      className={`mt-0.5 truncate text-[14px] font-semibold ${
                        destino
                          ? "text-[#111110]"
                          : "text-[#9B9A96]"
                      }`}
                    >
                      {destino?.name ??
                        "Seleccioná una localidad"}
                    </p>
                  </div>

                  <ChevronDown
                    size={17}
                    className="shrink-0 text-[#6B6A66]"
                  />
                </button>

                {/* EXACT DESTINATION ADDRESS */}

                <button
                  type="button"
                  onClick={() =>
                    setAddressSheet("destino")
                  }
                  disabled={!destino}
                  className="mt-3 flex w-full items-center gap-3 rounded-[12px] border border-[#E8E7E3] bg-[#F8F7F4] px-3 py-3 text-left disabled:opacity-50"
                >
                  <MapPin
                    size={17}
                    className="shrink-0 text-[#111110]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-[#8A8984]">
                      Dirección exacta
                    </p>

                    <p
                      className={`mt-0.5 text-[13px] ${
                        destinationPoint
                          ? "font-medium text-[#111110]"
                          : "text-[#9B9A96]"
                      }`}
                    >
                      {destinationPoint?.address ??
                        "Seleccioná una dirección"}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className="shrink-0 text-[#6B6A66]"
                  />
                </button>
              </div>
            </div>

            {/* ============================================
             * DATE
             * ============================================ */}

            <div className="mt-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#6B6A66]">
                Fecha
              </p>

              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                {dias.map((date, index) => {
                  const id = iso(date);

                  const active = id === fecha;

                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFecha(id)}
                      className="shrink-0 whitespace-nowrap"
                      style={{
                        height: 36,
                        borderRadius: 20,
                        padding: "0 16px",
                        fontSize: 14,
                        fontWeight: active ? 600 : 500,
                        background: active
                          ? "#1D9E75"
                          : "#F2F1ED",
                        color: active
                          ? "#FFFFFF"
                          : "#111110",
                      }}
                    >
                      {labelDia(date, index)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ============================================
             * SEARCH BUTTON
             * ============================================ */}

            <button
              type="button"
              onClick={handleSearch}
              disabled={!puedeBuscar}
              className="mt-7 w-full"
              style={{
                height: 52,
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
                background: puedeBuscar
                  ? "#1D9E75"
                  : "#D3D1C7",
                color: puedeBuscar
                  ? "#FFFFFF"
                  : "#9B9A96",
                cursor: puedeBuscar
                  ? "pointer"
                  : "not-allowed",
              }}
            >
              Ver viajes disponibles
            </button>

            {!puedeBuscar && (
              <p className="mt-3 text-center text-[12px] text-[#8A8984]">
                Seleccioná ambas direcciones para buscar viajes.
              </p>
            )}
          </>
        ) : (
          <>
            {/* ============================================
             * RESULTS HEADER
             * ============================================ */}

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-[#111110]">
                  {origen?.name} → {destino?.name}
                </p>

                <p className="mt-1 text-[12px] text-[#6B6A66]">
                  {fecha} ·{" "}
                  {loading
                    ? "Buscando…"
                    : `${viajes.length} ${
                        viajes.length === 1
                          ? "viaje"
                          : "viajes"
                      }`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetSearch}
                className="shrink-0 text-[13px] font-semibold text-[#1D9E75]"
              >
                Cambiar búsqueda
              </button>
            </div>

            {/* ============================================
             * SELECTED ADDRESSES
             * ============================================ */}

            <div className="mt-5 rounded-[14px] border border-[#E8E7E3] bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#1D9E75]" />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A8984]">
                    Origen
                  </p>

                  <p className="mt-1 text-[13px] font-medium leading-[1.4] text-[#111110]">
                    {originPoint?.address}
                  </p>
                </div>
              </div>

              <div className="ml-[4px] my-2 h-4 border-l border-dashed border-[#D3D1C7]" />

              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[#111110]" />

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8A8984]">
                    Destino
                  </p>

                  <p className="mt-1 text-[13px] font-medium leading-[1.4] text-[#111110]">
                    {destinationPoint?.address}
                  </p>
                </div>
              </div>
            </div>

            {/* ============================================
             * AVAILABLE TRIPS TITLE
             * ============================================ */}

            <h2 className="mb-3 mt-6 text-[17px] font-bold text-[#111110]">
              Viajes disponibles
            </h2>

            {/* ============================================
             * RESULTS
             * ============================================ */}

            <div className="space-y-3">
              {loading ? (
                <>
                  <TripCardSkeleton />
                  <TripCardSkeleton />
                  <TripCardSkeleton />
                </>
              ) : trips_query.isError ? (
                <div
                  className="rounded-[16px] p-6"
                  style={{
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <p className="text-[14px] font-semibold text-red-700">
                    No se pudieron cargar los viajes
                  </p>

                  <p className="mt-1 text-[12px] text-red-600">
                    {trips_query.error.message}
                  </p>

                  <button
                    type="button"
                    onClick={() => trips_query.refetch()}
                    className="mt-3 text-[13px] font-semibold text-red-700"
                  >
                    Reintentar
                  </button>
                </div>
              ) : viajes.length === 0 ? (
                <div className="rounded-[16px] bg-[#F2F1ED] p-8 text-center">
                  <p className="text-[14px] text-[#6B6A66]">
                    No encontramos viajes para esta ruta y fecha.
                  </p>

                  <p className="mt-2 text-[12px] text-[#8A8984]">
                    Probá con otra fecha o cambiando las direcciones.
                  </p>
                </div>
              ) : (
                viajes.map((trip) => (
                  <ResultCard
                    key={trip.id}
                    trip={trip}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* ================================================
       * LOCALITY PICKER
       * ================================================ */}

      <BottomSheet
        open={locationSheet !== null}
        onClose={() => setLocationSheet(null)}
        title={
          locationSheet === "origen"
            ? "Elegí el origen"
            : "Elegí el destino"
        }
      >
        <p className="-mt-2 mb-4 text-[13px] text-[#6B6A66]">
          Wayco opera en el corredor La Plata – CABA y zonas
          intermedias.
        </p>

        <div>
          {WAYCO_AREAS.map((city, index) => {
            const selected =
              locationSheet === "origen"
                ? city.name === origen?.name
                : city.name === destino?.name;

            const disabled =
              locationSheet === "origen"
                ? city.name === destino?.name
                : city.name === origen?.name;

            return (
              <button
                key={city.name}
                type="button"
                disabled={disabled}
                onClick={() => handleSelectArea(city)}
                className={`flex w-full items-center gap-3 py-4 text-left ${
                  disabled
                    ? "cursor-not-allowed opacity-40"
                    : ""
                }`}
                style={{
                  borderBottom:
                    index < WAYCO_AREAS.length - 1
                      ? "1px solid #F2F1ED"
                      : "none",
                }}
              >
                <MapPin
                  size={18}
                  color={
                    index < 2
                      ? "#1D9E75"
                      : "#9B9A96"
                  }
                />

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[#111110]">
                    {city.name}
                  </p>
                </div>

                {selected && (
                  <span className="font-bold text-[#1D9E75]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-center text-[12px] italic text-[#9B9A96]">
          ¿Tu ciudad no está? Pronto llegamos a más corredores.
        </p>
      </BottomSheet>

      {/* ================================================
       * ADDRESS PICKER
       * ================================================ */}

      <AddressPickerSheet
        open={addressSheet !== null}
        type={
          addressSheet === "destino"
            ? "destination"
            : "origin"
        }
        area={
          addressSheet === "origen"
            ? origen
            : addressSheet === "destino"
              ? destino
              : null
        }
        initialPoint={
          addressSheet === "origen"
            ? originPoint
            : addressSheet === "destino"
              ? destinationPoint
              : null
        }
        onClose={() => setAddressSheet(null)}
        onConfirm={handleConfirmAddress}
      />
    </div>
  );
}

/* =========================================================
 * RESULT CARD
 * ========================================================= */

function ResultCard({
  trip,
}: {
  trip: TripSearchResult;
}) {
  return (
    <Link
      to="/viaje/$id"
      params={{
        id: trip.id,
      }}
      className="wayco-card block active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <Avatar
          name={trip.driver?.name}
          size={38}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">
            {trip.driver?.name ?? "Conductor"}
          </p>

          {trip.driver?.averageRating != null && (
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--text-secondary)]">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

              {formatDecimal(
                trip.driver.averageRating,
              )}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <TripRoute
          origin={
            trip.originAddress
              ? `${trip.origin} - ${trip.originAddress}`
              : trip.origin
          }
          destination={
            trip.destinationAddress
              ? `${trip.destination} - ${trip.destinationAddress}`
              : trip.destination
          }
          time={trip.departureTime.slice(0, 5)}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="wayco-badge wayco-badge-success">
          {trip.availableSeats}{" "}
          libre
          {trip.availableSeats !== 1 ? "s" : ""}
        </span>

        <p
          className="text-[18px] font-bold"
          style={{
            color: "#1D9E75",
          }}
        >
          $
          {trip.pricePerSeat.toLocaleString("es-AR")}
        </p>
      </div>
    </Link>
  );
}