import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  Bell,
  Search,
} from "lucide-react";

import {
  getTripRouteInfo,
} from "@wayco/shared/pricing-engine";

import {
  AuthShell,
} from "@/components/layout/AuthShell";

import {
  Avatar,
} from "@/components/data-display/UserAvatar";

import {
  SectionHeader,
} from "@/components/layout/SectionHeader";

import {
  AdminAccessCard,
} from "@/features/admin/components/AdminAccessCard";

import {
  TripCard,
} from "@/features/trips/components/TripCard";

import {
  TripCardSkeleton,
} from "@/features/trips/components/TripCardSkeleton";

import type {
  TripCardData,
} from "@/features/trips/types/trip-card.types";

import {
  use_today_trips,
} from "@/features/trips/hooks/use_today_trips";

import {
  use_my_published_trips,
} from "@/features/trips/hooks/use_my_published_trips";

import {
  use_current_user,
} from "@/features/users/hooks/use_current_user";

import {
  use_current_user_capabilities,
} from "@/features/users/hooks/use_current_user_capabilities";

import {
  use_upcoming_reservations,
} from "@/features/reservations/hooks/use_upcoming_reservations";


export const Route =
  createFileRoute(
    "/auth/home",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Inicio — Wayco",
        },
      ],
    }),

    component:
      HomePage,
  });


function HomePage() {
  return (
    <AuthShell>
      <HomeContent />
    </AuthShell>
  );
}


function HomeContent() {
  const navigate =
    useNavigate();

  const current_user_query =
    use_current_user();

  const capabilities_query =
    use_current_user_capabilities();

  const today_trips_query =
    use_today_trips();

  const upcoming_reservations_query =
    use_upcoming_reservations();

  const published_trips_query =
    use_my_published_trips();


  const name =
    current_user_query.data?.name ??
    current_user_query.data?.email ??
    "";

  const firstName =
    name
      .trim()
      .split(/\s+/)[0] ||
    "viajero";


  /* =======================================================
   * TODAY TRIPS
   * ===================================================== */

  const cards: TripCardData[] =
    (today_trips_query.data ?? []).map(
      (trip) => ({
        id:
          trip.id,

        conductorNombre:
          trip.driver?.name ??
          "Conductor",

        rating:
          trip.driver
            ?.averageRating ??
          null,

        viajesConductor:
          trip.driver
            ?.totalTrips,

        origen:
          trip.origin,

        destino:
          trip.destination,

        hora:
          trip.departureTime.slice(
            0,
            5,
          ),

        duracionMin:
          getTripRouteInfo(
            trip.origin,
            trip.destination,
          ).durationMinutes,

        asientosDisponibles:
          trip.availableSeats,

        asientosTotales:
          trip.totalSeats,

        vehiculo:
          trip.vehicleDescription,

        precio:
          trip.pricePerSeat,

        badge: {
          label:
            "Precio calculado por Wayco",

          tone:
            "success",
        },
      }),
    );


  const isTripsLoading =
    today_trips_query.isPending;


  /* =======================================================
   * UPCOMING PASSENGER TRIPS
   * ===================================================== */

  const upcomingReservations =
    upcoming_reservations_query.data ??
    [];


  /* =======================================================
   * UPCOMING DRIVER TRIPS
   * ===================================================== */

  const upcomingPublishedTrips =
    (published_trips_query.data ?? [])
      .filter(
        (trip) => {
          if (
            trip.status !==
            "activo"
          ) {
            return false;
          }

          const departure =
            createTripDepartureDate(
              trip.date,
              trip.departureTime,
            );

          return (
            departure !==
              null &&
            departure.getTime() >
              Date.now()
          );
        },
      )
      .sort(
        (
          firstTrip,
          secondTrip,
        ) => {
          const firstDeparture =
            createTripDepartureDate(
              firstTrip.date,
              firstTrip.departureTime,
            );

          const secondDeparture =
            createTripDepartureDate(
              secondTrip.date,
              secondTrip.departureTime,
            );

          if (
            !firstDeparture ||
            !secondDeparture
          ) {
            return 0;
          }

          return (
            firstDeparture.getTime() -
            secondDeparture.getTime()
          );
        },
      );


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div className="pb-6">
      <header
        className="flex items-center justify-between bg-white px-5 py-4"
        style={{
          borderBottom:
            "1px solid var(--border-color)",
        }}
      >
        <Link
          to="/perfil"
          aria-label="Mi perfil"
        >
          <Avatar
            name={
              name ||
              firstName
            }
            size={
              40
            }
          />
        </Link>

        <span className="text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
          Wayco
        </span>

        <button
          type="button"
          aria-label="Notificaciones"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--surface-2)]"
        >
          <Bell
            className="size-[22px] text-[var(--text-primary)]"
            strokeWidth={
              1.5
            }
          />
        </button>
      </header>


      {current_user_query.isError && (
        <ErrorMessage
          message={
            current_user_query
              .error
              .message
          }
        />
      )}


      {capabilities_query.isError && (
        <ErrorMessage
          message={
            capabilities_query
              .error
              .message
          }
        />
      )}


      {today_trips_query.isError && (
        <ErrorMessage
          message={
            today_trips_query
              .error
              .message
          }
        />
      )}


      {upcoming_reservations_query.isError && (
        <ErrorMessage
          message={
            upcoming_reservations_query
              .error
              .message
          }
        />
      )}


      {published_trips_query.isError && (
        <ErrorMessage
          message={
            published_trips_query
              .error
              .message
          }
        />
      )}


      <section className="px-5 pt-6">
        {current_user_query.isPending ? (
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--surface-2)]" />
        ) : (
          <p className="text-[13px] text-[var(--text-secondary)]">
            Hola, {firstName} 👋
          </p>
        )}

        <h1 className="wayco-title mt-1">
          ¿A dónde vas hoy?
        </h1>

        <div className="wayco-card-lg mt-5">
          <button
            type="button"
            onClick={() =>
              navigate({
                to:
                  "/buscar",
              })
            }
            className="flex h-[52px] w-full items-center gap-3 rounded-[12px] bg-[var(--surface-2)] px-4 text-left"
          >
            <Search
              className="size-5 text-[var(--text-secondary)]"
              strokeWidth={
                1.8
              }
            />

            <span className="text-[15px] text-[var(--text-secondary)]">
              ¿A dónde vas hoy?
            </span>
          </button>

          <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
            <Link
              to="/buscar"
              className="wayco-chip"
            >
              La Plata → CABA
            </Link>

            <Link
              to="/buscar"
              className="wayco-chip"
            >
              CABA → La Plata
            </Link>

            <Link
              to="/buscar"
              className="wayco-chip wayco-chip-muted"
            >
              Hudson → CABA
            </Link>
          </div>
        </div>
      </section>


      {/* ===================================================
       * ADMINISTRATION
       * ================================================= */}

      {capabilities_query.data?.isAdministrative && (
        <section className="mt-8 px-5">
          <SectionHeader>
            Administración
          </SectionHeader>

          <AdminAccessCard />
        </section>
      )}


      {/* ===================================================
       * AVAILABLE TODAY
       * ================================================= */}

      <section className="mt-8 px-5">
        <SectionHeader>
          Disponibles hoy
        </SectionHeader>

        <div className="space-y-3">
          {isTripsLoading ? (
            <>
              <TripCardSkeleton />
              <TripCardSkeleton />
            </>
          ) : cards.length === 0 ? (
            <div className="rounded-[16px] bg-[var(--surface-2)] p-6 text-center text-[14px] text-[var(--text-secondary)]">
              No hay viajes publicados para hoy.
            </div>
          ) : (
            cards.map(
              (trip) => (
                <TripCard
                  key={
                    trip.id
                  }
                  trip={
                    trip
                  }
                />
              ),
            )
          )}
        </div>
      </section>


      {/* ===================================================
       * UPCOMING PASSENGER TRIPS
       * ================================================= */}

      {upcoming_reservations_query.isPending && (
        <section className="mt-8 px-5">
          <SectionHeader>
            Tus próximos viajes
          </SectionHeader>

          <UpcomingTripsSkeleton />
        </section>
      )}


      {!upcoming_reservations_query.isPending &&
        upcomingReservations.length > 0 && (
          <section className="mt-8 px-5">
            <SectionHeader>
              Tus próximos viajes
            </SectionHeader>

            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
              {upcomingReservations.map(
                (
                  reservation,
                ) => (
                  <Link
                    key={
                      reservation.id
                    }
                    to="/viaje/$id"
                    params={{
                      id:
                        reservation.trip.id,
                    }}
                    className="wayco-card min-w-[240px] !p-4"
                  >
                    <p className="wayco-eyebrow !text-[10px]">
                      {formatReservationStatus(
                        reservation.status,
                      )}
                    </p>

                    <p className="mt-2 text-[14px] font-semibold text-[var(--text-primary)]">
                      {
                        reservation
                          .trip
                          .origin
                      }{" "}
                      →{" "}
                      {
                        reservation
                          .trip
                          .destination
                      }
                    </p>

                    <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
                      {
                        reservation
                          .trip
                          .date
                      }{" "}
                      ·{" "}
                      {reservation
                        .trip
                        .departureTime
                        .slice(
                          0,
                          5,
                        )}
                    </p>

                    <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
                      {
                        reservation.seats
                      }{" "}
                      {reservation.seats ===
                      1
                        ? "asiento"
                        : "asientos"}
                    </p>
                  </Link>
                ),
              )}
            </div>
          </section>
        )}


      {/* ===================================================
       * UPCOMING DRIVER TRIPS
       * ================================================= */}

      {published_trips_query.isPending && (
        <section className="mt-8 px-5">
          <SectionHeader>
            Tus próximos viajes como conductor
          </SectionHeader>

          <UpcomingTripsSkeleton />
        </section>
      )}


      {!published_trips_query.isPending &&
        upcomingPublishedTrips.length > 0 && (
          <section className="mt-8 px-5">
            <SectionHeader>
              Tus próximos viajes como conductor
            </SectionHeader>

            <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
              {upcomingPublishedTrips.map(
                (trip) => (
                  <Link
                    key={
                      trip.id
                    }
                    to="/viaje/$id"
                    params={{
                      id:
                        trip.id,
                    }}
                    className="wayco-card min-w-[240px] !p-4"
                  >
                    <p className="wayco-eyebrow !text-[10px]">
                      Conducís este viaje
                    </p>

                    <p className="mt-2 text-[14px] font-semibold text-[var(--text-primary)]">
                      {trip.origin}
                      {" → "}
                      {trip.destination}
                    </p>

                    <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
                      {trip.date}
                      {" · "}
                      {trip.departureTime.slice(
                        0,
                        5,
                      )}
                    </p>

                    <p className="mt-2 text-[11px] text-[var(--text-secondary)]">
                      {trip.availableSeats}
                      {" de "}
                      {trip.totalSeats}
                      {" "}
                      {trip.availableSeats ===
                      1
                        ? "asiento disponible"
                        : "asientos disponibles"}
                    </p>
                  </Link>
                ),
              )}
            </div>
          </section>
        )}
    </div>
  );
}


/* =========================================================
 * UPCOMING TRIPS SKELETON
 * ======================================================= */

function UpcomingTripsSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      <div className="h-28 min-w-[240px] animate-pulse rounded-[16px] bg-[var(--surface-2)]" />

      <div className="h-28 min-w-[240px] animate-pulse rounded-[16px] bg-[var(--surface-2)]" />
    </div>
  );
}


/* =========================================================
 * TRIP DATE
 * ======================================================= */

function createTripDepartureDate(
  date:
    string,

  departureTime:
    string,
): Date | null {
  const normalizedTime =
    departureTime.slice(
      0,
      8,
    );

  const value =
    new Date(
      `${date}T${normalizedTime}`,
    );


  if (
    Number.isNaN(
      value.getTime(),
    )
  ) {
    return null;
  }


  return value;
}


/* =========================================================
 * ERROR MESSAGE
 * ======================================================= */

function ErrorMessage({
  message,
}: {
  message:
    string;
}) {
  return (
    <div className="mx-5 mt-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
      {message}
    </div>
  );
}


/* =========================================================
 * RESERVATION STATUS
 * ======================================================= */

function formatReservationStatus(
  status:
    | "pendiente"
    | "confirmada"
    | "cancelada"
    | "rechazada",
): string {
  const labels = {
    pendiente:
      "Pendiente",

    confirmada:
      "Confirmada",

    cancelada:
      "Cancelada",

    rechazada:
      "Rechazada",
  };


  return labels[
    status
  ];
}