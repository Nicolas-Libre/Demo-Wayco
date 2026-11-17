import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  CalendarX,
} from "lucide-react";

import {
  toast,
} from "sonner";

import { AuthShell } from "@/components/layout/AuthShell";
import { BottomSheet } from "@/components/overlays/BottomSheet";

import { TripBadge } from "@/features/trips/components/TripBadge";
import { TripRoute } from "@/features/trips/components/TripRoute";

import {
  use_my_reservations,
} from "@/features/reservations/hooks/use_my_reservations";

import {
  use_cancel_reservation,
} from "@/features/reservations/hooks/use_cancel_reservation";

import {
  use_decide_reservation,
} from "@/features/reservations/hooks/use_decide_reservation";

import {
  use_my_published_trips,
} from "@/features/trips/hooks/use_my_published_trips";

import {
  use_cancel_published_trip,
} from "@/features/trips/hooks/use_cancel_published_trip";

import {
  formatARS,
} from "@/lib/formatters/currency";

import { TripCompletionPanel } from "@/features/trips/components/TripCompletionPanel";


export const Route =
  createFileRoute(
    "/mis-viajes",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Mis viajes — Wayco",
        },
      ],
    }),

    component: () => (
      <AuthShell>
        <MisViajesPage />
      </AuthShell>
    ),
  });


type Tab =
  | "pasajero"
  | "conductor";

function departureHasPassed(
  date: string,
  departureTime: string,
): boolean {
  const departure = new Date(
    `${date}T${departureTime.slice(0, 8).padEnd(8, "0")}-03:00`,
  );

  return (
    !Number.isNaN(departure.getTime()) &&
    Date.now() >= departure.getTime()
  );
}

function MisViajesPage() {
  const [
    tab,
    setTab,
  ] =
    useState<Tab>(
      "pasajero",
    );

  const [
    cancelTripId,
    setCancelTripId,
  ] =
    useState<
      string | null
    >(null);
  const [completionTripId, setCompletionTripId] =
    useState<string | null>(null);


  /* =======================================================
   * QUERIES
   * ===================================================== */

  const reservations_query =
    use_my_reservations();

  const trips_query =
    use_my_published_trips();


  /* =======================================================
   * MUTATIONS
   * ===================================================== */

  const cancel_reservation_mutation =
    use_cancel_reservation();

  const decide_reservation_mutation =
    use_decide_reservation();

  const cancel_trip_mutation =
    use_cancel_published_trip();


  const reservations = (
    reservations_query.data ?? []
  ).filter(
    (reservation) =>
      reservation.trip?.status !== "finalizado",
  );

  const trips = (
    trips_query.data ?? []
  ).filter(
    (trip) => trip.status !== "finalizado",
  );


  /* =======================================================
   * PASSENGER CANCEL
   * ===================================================== */

  async function cancelarReserva(
    reservation_id: string,
    trip_id: string,
  ) {
    try {
      await cancel_reservation_mutation
        .mutateAsync({
          reservation_id,
          trip_id,
        });

      toast.success(
        "Reserva cancelada",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo cancelar la reserva.",
      );
    }
  }


  /* =======================================================
   * DRIVER DECISION
   * ===================================================== */

  async function actualizarReserva(
    reservation_id: string,
    status:
      | "confirmada"
      | "rechazada",
  ) {
    try {
      await decide_reservation_mutation
        .mutateAsync({
          reservation_id,

          input: {
            status,
          },
        });

      toast.success(
        status ===
          "confirmada"
          ? "Reserva confirmada"
          : "Reserva rechazada",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la reserva.",
      );
    }
  }


  /* =======================================================
   * CANCEL TRIP
   * ===================================================== */

  async function cancelarViaje(
    trip_id: string,
  ) {
    try {
      await cancel_trip_mutation
        .mutateAsync(
          trip_id,
        );

      setCancelTripId(
        null,
      );

      toast.success(
        "Viaje cancelado",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo cancelar el viaje.",
      );
    }
  }


  /* =======================================================
   * HELPERS
   * ===================================================== */

  const estadoTone = (
    status: string,
  ):
    | "success"
    | "warning"
    | "neutral" =>
    status ===
      "confirmada" ||
    status ===
      "activo"
      ? "success"
      : status ===
          "pendiente"
        ? "warning"
        : "neutral";


  const estadoLabel = (
    status: string,
  ): string => ({
    pendiente:
      "Pendiente",

    confirmada:
      "Confirmada",

    cancelada:
      "Cancelada",

    rechazada:
      "Rechazada",

    activo:
      "Activo",

    cancelado:
      "Cancelado",

    finalizado:
      "Finalizado",
  })[
    status
  ] ?? status;


  const loading =
    tab ===
    "pasajero"
      ? reservations_query
          .isPending
      : trips_query
          .isPending;


  const error =
    tab ===
    "pasajero"
      ? reservations_query
          .error
      : trips_query
          .error;


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div className="px-5 pt-6">
      <h1 className="text-[24px] font-bold text-[#111110]">
        Mis viajes
      </h1>


      {/* SEGMENTED CONTROL */}

      <div
        className="mt-5 flex rounded-[10px] p-1"
        style={{
          background:
            "#F2F1ED",
        }}
      >
        <SegBtn
          active={
            tab ===
            "pasajero"
          }
          onClick={() =>
            setTab(
              "pasajero",
            )
          }
        >
          Como pasajero
        </SegBtn>

        <SegBtn
          active={
            tab ===
            "conductor"
          }
          onClick={() =>
            setTab(
              "conductor",
            )
          }
        >
          Como conductor
        </SegBtn>
      </div>


      {/* ERROR */}

      {error && (
        <div className="mt-5 rounded-[12px] border border-red-300 bg-red-50 p-4">
          <p className="text-[13px] font-semibold text-red-700">
            No se pudieron cargar los viajes
          </p>

          <p className="mt-1 text-[12px] text-red-600">
            {error.message}
          </p>
        </div>
      )}


      <section className="mt-5 space-y-3">
        {loading ? (
          <p className="text-center text-[14px] text-[#6B6A66]">
            Cargando…
          </p>
        ) : tab ===
          "pasajero" ? (
          /* ===============================================
           * PASSENGER
           * ============================================= */

          reservations.length ===
          0 ? (
            <EmptyState
              text="Todavía no reservaste ningún viaje."
              cta={{
                to:
                  "/buscar",

                label:
                  "Buscar viaje",
              }}
            />
          ) : (
            reservations.map(
              (
                reservation,
              ) => (
                <div
                  key={
                    reservation.id
                  }
                  className="rounded-[16px] border bg-white p-4"
                  style={{
                    borderColor:
                      "#E2E0D8",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] text-[#6B6A66]">
                      {reservation
                        .trip
                        ?.driver
                        ?.name ??
                        "Conductor"}

                      {" · "}

                      {reservation
                        .trip
                        ?.date ??
                        ""}

                      {" · "}

                      {reservation
                        .trip
                        ?.departureTime
                        .slice(
                          0,
                          5,
                        ) ??
                        ""}
                    </p>

                    <TripBadge
                      label={
                        estadoLabel(
                          reservation.status,
                        )
                      }
                      tone={
                        estadoTone(
                          reservation.status,
                        )
                      }
                    />
                  </div>


                  <div className="mt-3">
                    <TripRoute
                      origin={
                        reservation
                          .trip
                          ?.origin ??
                        ""
                      }
                      destination={
                        reservation
                          .trip
                          ?.destination ??
                        ""
                      }
                    />
                  </div>


                  <div
                    className="mt-3 flex items-center justify-between border-t pt-3"
                    style={{
                      borderColor:
                        "#F2F1ED",
                    }}
                  >
                    <span className="text-[13px] text-[#6B6A66]">
                      {
                        reservation.seats
                      }{" "}
                      as. ·{" "}

                      <strong className="text-[#111110]">
                        {formatARS(
                          reservation.seats *
                            (
                              reservation
                                .trip
                                ?.pricePerSeat ??
                              0
                            ),
                        )}
                      </strong>
                    </span>


                    <div className="flex items-center gap-3">
                      {reservation.trip && (
                        <Link
                          to="/viaje/$id"
                          params={{
                            id:
                              reservation
                                .trip.id,
                          }}
                          className="text-[13px] font-semibold"
                          style={{
                            color:
                              "#1D9E75",
                          }}
                        >
                          Ver detalle
                        </Link>
                      )}

                      {reservation.trip &&
                        reservation.status === "confirmada" &&
                        reservation.trip.status === "activo" &&
                        departureHasPassed(
                          reservation.trip.date,
                          reservation.trip.departureTime,
                        ) && (
                        <button
                          type="button"
                          onClick={() =>
                            setCompletionTripId(reservation.trip!.id)
                          }
                          className="text-[13px] font-semibold"
                          style={{ color: "#1D9E75" }}
                        >
                          Calificar viaje
                        </button>
                      )}

                      {(reservation.status ===
                        "pendiente" ||
                        reservation.status ===
                          "confirmada") &&
                        reservation.trip && 
                        !departureHasPassed(
                          reservation.trip.date,
                          reservation.trip.departureTime,
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              cancelarReserva(
                                reservation.id,
                                reservation.trip!.id,
                              )
                            }
                            disabled={
                              cancel_reservation_mutation
                                .isPending
                            }
                            className="text-[13px] font-medium text-[var(--destructive)] disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ),
            )
          )
        ) : (
          /* ===============================================
           * DRIVER
           * ============================================= */

          trips.length ===
          0 ? (
            <EmptyState
              text="Todavía no publicaste ningún viaje."
              cta={{
                to:
                  "/publicar",

                label:
                  "Publicar viaje",
              }}
            />
          ) : (
            trips.map(
              (
                trip,
              ) => (
                <div
                  key={
                    trip.id
                  }
                  className="rounded-[16px] border bg-white p-4"
                  style={{
                    borderColor:
                      "#E2E0D8",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] text-[#6B6A66]">
                      {
                        trip.date
                      }

                      {" · "}

                      {trip.departureTime.slice(
                        0,
                        5,
                      )}

                      {" · "}

                      {
                        trip.availableSeats
                      }
                      /
                      {
                        trip.totalSeats
                      }{" "}
                      libres
                    </p>

                    <TripBadge
                      label={
                        estadoLabel(
                          trip.status,
                        )
                      }
                      tone={
                        estadoTone(
                          trip.status,
                        )
                      }
                    />
                  </div>


                  <div className="mt-3">
                    <TripRoute
                      origin={
                        trip.origin
                      }
                      destination={
                        trip.destination
                      }
                    />
                  </div>


                  {trip.reservations.length >
                    0 && (
                    <div
                      className="mt-3 space-y-2 border-t pt-3"
                      style={{
                        borderColor:
                          "#F2F1ED",
                      }}
                    >
                      {trip.reservations.map(
                        (
                          reservation,
                        ) => (
                          <div
                            key={
                              reservation.id
                            }
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[13px] font-medium">
                                {reservation
                                  .passenger
                                  ?.name ??
                                  "Pasajero"}

                                {" · "}

                                {
                                  reservation.seats
                                }{" "}
                                as.
                              </p>

                              <div className="mt-0.5">
                                <TripBadge
                                  label={
                                    estadoLabel(
                                      reservation.status,
                                    )
                                  }
                                  tone={
                                    estadoTone(
                                      reservation.status,
                                    )
                                  }
                                />
                              </div>
                            </div>


                            {reservation.status ===
                              "pendiente" && (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    actualizarReserva(
                                      reservation.id,
                                      "confirmada",
                                    )
                                  }
                                  disabled={
                                    decide_reservation_mutation
                                      .isPending
                                  }
                                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
                                  style={{
                                    background:
                                      "#1D9E75",
                                  }}
                                >
                                  Confirmar
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    actualizarReserva(
                                      reservation.id,
                                      "rechazada",
                                    )
                                  }
                                  disabled={
                                    decide_reservation_mutation
                                      .isPending
                                  }
                                  className="rounded-full border px-3 py-1.5 text-[12px] font-medium text-[var(--destructive)] disabled:opacity-50"
                                  style={{
                                    borderColor:
                                      "#E2E0D8",
                                  }}
                                >
                                  Rechazar
                                </button>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}


                  <div className="mt-3 flex items-center gap-4">
                    <Link
                      to="/viaje/$id"
                      params={{
                        id:
                          trip.id,
                      }}
                      className="text-[13px] font-semibold"
                      style={{
                        color:
                          "#1D9E75",
                      }}
                    >
                      Ver detalle
                    </Link>
                    
                    {trip.status === "activo" &&
                      departureHasPassed(
                        trip.date,
                        trip.departureTime,
                      ) && (
                      <button
                        type="button"
                        onClick={() => setCompletionTripId(trip.id)}
                        className="text-[13px] font-semibold"
                        style={{ color: "#1D9E75" }}
                      >
                        Finalizar / Calificar
                      </button>
                    )}

                    {trip.status === "activo" &&
                    !departureHasPassed(
                      trip.date,
                      trip.departureTime,
                    ) && (
                      <button
                        type="button"
                        onClick={() =>
                          setCancelTripId(
                            trip.id,
                          )
                        }
                        className="text-[13px] font-medium text-[var(--destructive)]"
                      >
                        Cancelar viaje
                      </button>
                    )}
                  </div>
                </div>
              ),
            )
          )
        )}
      </section>


      {/* CANCEL TRIP */}

      <BottomSheet
        open={
          Boolean(
            cancelTripId,
          )
        }
        onClose={() =>
          setCancelTripId(
            null,
          )
        }
        title="¿Cancelar este viaje?"
      >
        <p className="text-[14px] text-[#6B6A66]">
          Las reservas pendientes y confirmadas de este viaje también
          serán canceladas.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => {
              if (
                cancelTripId
              ) {
                void cancelarViaje(
                  cancelTripId,
                );
              }
            }}
            disabled={
              cancel_trip_mutation
                .isPending
            }
            className="wayco-btn wayco-btn-primary disabled:opacity-50"
            style={{
              background:
                "var(--destructive)",
            }}
          >
            {cancel_trip_mutation
              .isPending
              ? "Cancelando…"
              : "Sí, cancelar viaje"}
          </button>

          <button
            type="button"
            onClick={() =>
              setCancelTripId(
                null,
              )
            }
            disabled={
              cancel_trip_mutation
                .isPending
            }
            className="wayco-btn wayco-btn-secondary"
          >
            Volver
          </button>
        </div>
      </BottomSheet>

      <BottomSheet
        open={Boolean(completionTripId)}
        onClose={() => setCompletionTripId(null)}
        title="Finalización del viaje"
      >
        {completionTripId && (
          <TripCompletionPanel
            tripId={completionTripId}
            onCompleted={() => {
              setCompletionTripId(null);
              toast.success("Viaje finalizado correctamente");
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}


function SegBtn({
  active,
  children,
  onClick,
}: {
  active:
    boolean;

  children:
    React.ReactNode;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="flex-1 rounded-[8px] py-2 text-[13px] font-semibold transition-all"
      style={{
        background:
          active
            ? "white"
            : "transparent",

        color:
          active
            ? "#111110"
            : "#6B6A66",

        boxShadow:
          active
            ? "0 1px 3px rgba(0,0,0,0.08)"
            : undefined,
      }}
    >
      {children}
    </button>
  );
}


function EmptyState({
  text,
  cta,
}: {
  text:
    string;

  cta: {
    to:
      string;

    label:
      string;
  };
}) {
  return (
    <div
      className="flex flex-col items-center rounded-[16px] border border-dashed p-10 text-center"
      style={{
        borderColor:
          "#E2E0D8",
      }}
    >
      <CalendarX
        className="h-12 w-12"
        style={{
          color:
            "#D3D1C7",
        }}
        strokeWidth={
          1.5
        }
      />

      <p className="mt-4 text-[14px] text-[#6B6A66]">
        {text}
      </p>

      <Link
        to={
          cta.to
        }
        className="mt-3 text-[14px] font-semibold"
        style={{
          color:
            "#1D9E75",
        }}
      >
        {cta.label} →
      </Link>
    </div>
  );
}