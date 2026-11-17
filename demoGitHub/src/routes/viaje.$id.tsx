import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  BadgeCheck,
  Car,
  Copy,
} from "lucide-react";

import { toast } from "sonner";

import type {
  ReservationForTrip,
} from "@wayco/shared/reservations";

import {
  formatARS,
} from "@/lib/formatters/currency";

import { AuthShell } from "@/components/layout/AuthShell";
import { BottomSheet } from "@/components/overlays/BottomSheet";

import { TripBadge } from "@/features/trips/components/TripBadge";
import { TripRoute } from "@/features/trips/components/TripRoute";
import { TripRouteMap } from "@/features/maps/components/TripRouteMap";

import {
  use_trip_detail,
} from "@/features/trips/hooks/use_trip_detail";

import {
  use_current_user,
} from "@/features/users/hooks/use_current_user";

import {
  use_reservation_for_trip,
} from "@/features/reservations/hooks/use_reservation_for_trip";

import {
  use_create_reservation,
} from "@/features/reservations/hooks/use_create_reservation";

import {
  use_cancel_reservation,
} from "@/features/reservations/hooks/use_cancel_reservation";


export const Route =
  createFileRoute(
    "/viaje/$id",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Detalle de viaje — Wayco",
        },
      ],
    }),

    component: () => (
      <AuthShell>
        <ViajeDetalle />
      </AuthShell>
    ),
  });


function ViajeDetalle() {
  const {
    id,
  } = Route.useParams();

  const navigate =
    useNavigate();


  /* =======================================================
   * QUERIES
   * ===================================================== */

  const current_user_query =
    use_current_user();

  const trip_query =
    use_trip_detail({
      id,
    });

  const reservation_query =
    use_reservation_for_trip({
      trip_id:
        id,
    });


  /* =======================================================
   * MUTATIONS
   * ===================================================== */

  const create_reservation_mutation =
    use_create_reservation();

  const cancel_reservation_mutation =
    use_cancel_reservation();


  /* =======================================================
   * UI STATE
   * ===================================================== */

  const [
    confirmSheet,
    setConfirmSheet,
  ] =
    useState(false);

  const [
    cancelSheet,
    setCancelSheet,
  ] =
    useState(false);


  /* =======================================================
   * RESOLVED DATA
   * ===================================================== */

  const trip =
    trip_query.data ??
    null;

  const currentUserId =
    current_user_query.data?.id ??
    null;

  const miReserva =
    reservation_query.data ??
    null;


  /* =======================================================
   * ERROR HANDLING
   * ===================================================== */

  useEffect(() => {
    if (
      trip_query.isError
    ) {
      toast.error(
        trip_query.error.message ||
          "Viaje no encontrado",
      );

      navigate({
        to:
          "/buscar",
      });
    }
  }, [
    navigate,
    trip_query.error,
    trip_query.isError,
  ]);


  /* =======================================================
   * CREATE RESERVATION
   * ===================================================== */

  async function reservar() {
    if (!trip) {
      return;
    }

    try {
      await create_reservation_mutation
        .mutateAsync({
          tripId:
            trip.id,

          seats:
            1,
        });

      setConfirmSheet(
        false,
      );

      toast.success(
        "¡Reserva creada! Coordiná la transferencia con el conductor.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear la reserva.",
      );
    }
  }


  /* =======================================================
   * CANCEL RESERVATION
   * ===================================================== */

  async function cancelarReserva() {
    if (
      !miReserva ||
      !trip
    ) {
      return;
    }

    try {
      await cancel_reservation_mutation
        .mutateAsync({
          reservation_id:
            miReserva.id,

          trip_id:
            trip.id,
        });

      setCancelSheet(
        false,
      );

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
   * LOADING
   * ===================================================== */

  const loading =
    trip_query.isPending ||
    current_user_query.isPending ||
    reservation_query.isPending;

  if (
    loading ||
    !trip
  ) {
    return (
      <div className="px-6 pt-10 text-center text-[var(--text-secondary)]">
        Cargando…
      </div>
    );
  }


  /* =======================================================
   * DERIVED DATA
   * ===================================================== */

  const esConductor =
    currentUserId ===
    trip.driverId;

  const anioMiembro =
    trip.driver?.createdAt
      ? new Date(
          trip.driver.createdAt,
        ).getFullYear()
      : new Date()
          .getFullYear();


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div className="pb-8">
      <header
        className="sticky top-0 z-10 flex items-center gap-3 bg-white px-5 py-3"
        style={{
          borderBottom:
            "1px solid var(--border-color)",
        }}
      >
        <button
          type="button"
          onClick={() =>
            history.back()
          }
          aria-label="Volver"
          className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-[var(--surface-2)]"
        >
          <ArrowLeft className="size-5" />
        </button>

        <h1 className="text-[16px] font-semibold">
          Detalle del viaje
        </h1>
      </header>


      <div className="px-5 pt-5">
        {/* DRIVER */}

        <div
          className="rounded-[16px] border bg-white p-5"
          style={{
            borderColor:
              "#E2E0D8",
          }}
        >
          <div className="flex items-start gap-4">
            <span
              className="inline-flex size-16 items-center justify-center rounded-full text-[24px] font-semibold text-white"
              style={{
                background:
                  "#1D9E75",
              }}
            >
              {(
                trip.driver
                  ?.name?.[0] ??
                "?"
              ).toUpperCase()}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-bold text-[#111110]">
                {trip.driver
                  ?.name ??
                  "Conductor"}
              </p>

              <p className="text-[12px] text-[#6B6A66]">
                Wayco Member desde{" "}
                {anioMiembro}
              </p>

              <div
                className="mt-2 flex items-center gap-1 text-[12px]"
                style={{
                  color:
                    "#0F6E56",
                }}
              >
                <BadgeCheck className="size-4" />

                <span className="font-medium">
                  Conductor verificado
                </span>
              </div>
            </div>
          </div>

          <div
            className="mt-4 grid grid-cols-3 gap-2 border-t pt-4"
            style={{
              borderColor:
                "#F2F1ED",
            }}
          >
            <Stat
              value={`★ ${(trip.driver?.averageRating ?? 5).toFixed(1)}`}
              label="Score"
            />

            <Stat
              value={String(
                trip.driver
                  ?.totalTrips ??
                  0,
              )}
              label="Viajes"
              divider
            />

            <Stat
              value="100%"
              label="Confirma"
              divider
            />
          </div>

          {trip.vehicleDescription && (
            <div className="mt-4 flex items-center gap-3 rounded-[12px] bg-[#F2F1ED] p-3">
              <Car
                className="size-5 text-[#0F6E56]"
                strokeWidth={
                  1.8
                }
              />

              <p className="text-[13px] font-medium text-[#111110]">
                {trip.vehicleDescription}
              </p>
            </div>
          )}
        </div>


        {/* ROUTE */}

        <div
          className="mt-4 rounded-[16px] border bg-white p-5"
          style={{
            borderColor:
              "#E2E0D8",
          }}
        >
          <TripRoute
            origin={trip.origin}
            originAddress={trip.originAddress}
            destination={trip.destination}
            destinationAddress={trip.destinationAddress}
            time={trip.departureTime.slice(0, 5)}
            durationMinutes={trip.route.durationMinutes}
            size="lg"
          />

          <p className="mt-4 text-[12px] text-[#6B6A66]">
            {
              trip.route
                .distanceKm
            }{" "}
            km ·{" "}
            {
              trip.route
                .description
            }
          </p>
          <div className="mt-5">
  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
    Recorrido del viaje
  </p>

  <TripRouteMap
    polyline={trip.route.polyline}
  />
</div>
        </div>


        {/* PRICE */}

        <div
          className="mt-4 rounded-[16px] p-5"
          style={{
            background:
              "#F2F1ED",
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
            Cómo se calcula tu parte
          </p>

          {trip.pricing ? (
            <div className="mt-3 space-y-2 text-[14px] text-[#111110]">
              <RowKV
                k={`Combustible (${trip.route.distanceKm}km)`}
                v={formatARS(
                  trip.pricing
                    .fuelCost,
                )}
              />

              <RowKV
                k="Peaje"
                v={formatARS(
                  trip.pricing
                    .tollCost,
                )}
              />

              <RowKV
                k="Desgaste del vehículo"
                v={formatARS(
                  trip.pricing
                    .totalWearCost,
                )}
              />

              <div
                className="flex items-center justify-between border-t pt-1.5"
                style={{
                  borderColor:
                    "#D3D1C7",
                }}
              >
                <span className="text-[#6B6A66]">
                  Total del recorrido
                </span>

                <span className="font-semibold">
                  {formatARS(
                    trip.pricing
                      .totalTripCost,
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 rounded-[10px] bg-white p-3">
              <p className="text-[12px] leading-[1.5] text-[#6B6A66]">
                El desglose completo no está disponible para este
                viaje porque fue creado antes de registrar el vehículo
                asociado.
              </p>
            </div>
          )}

          <div
            className="mt-4 border-t pt-3"
            style={{
              borderColor:
                "#D3D1C7",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold text-[#111110]">
                Tu parte del viaje
              </p>

              <p
                className="text-[24px] font-bold"
                style={{
                  color:
                    "#1D9E75",
                }}
              >
                {formatARS(
                  trip.pricePerSeat,
                )}
              </p>
            </div>
          </div>

          <p className="mt-3 text-[11px] italic text-[#6B6A66]">
            Combustible y peajes se dividen entre todos
            (conductor + pasajeros). El desgaste del auto lo
            cubren solo los pasajeros.
          </p>

          {!esConductor &&
            !miReserva &&
            trip.status ===
              "activo" &&
            trip.availableSeats >
              0 && (
              <button
                type="button"
                onClick={() =>
                  setConfirmSheet(
                    true,
                  )
                }
                disabled={
                  create_reservation_mutation
                    .isPending
                }
                className="wayco-btn wayco-btn-primary mt-5 disabled:opacity-50"
              >
                {create_reservation_mutation
                  .isPending
                  ? "Reservando…"
                  : "Reservar asiento"}
              </button>
            )}
        </div>


        {/* MY RESERVATION */}

        {miReserva &&
          !esConductor && (
            <ReservaInfo
              reserva={
                miReserva
              }
              cbu={
                trip.driver
                  ?.cbuAlias ??
                null
              }
              total={
                miReserva.seats *
                trip.pricePerSeat
              }
              onCancel={() =>
                setCancelSheet(
                  true,
                )
              }
            />
          )}


        {/* NOTES */}

        {trip.notes && (
          <div
            className="mt-4 rounded-[16px] border bg-white p-4"
            style={{
              borderColor:
                "#E2E0D8",
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
              Notas del conductor
            </p>

            <p className="mt-1 whitespace-pre-wrap text-[14px] text-[#111110]">
              {trip.notes}
            </p>
          </div>
        )}


        {/* DRIVER MESSAGE */}

        {esConductor && (
          <div
            className="mt-4 rounded-[14px] border border-dashed p-4 text-center text-[13px] text-[#6B6A66]"
            style={{
              borderColor:
                "#D3D1C7",
            }}
          >
            Este viaje es tuyo. Gestioná las reservas desde{" "}

            <Link
              to="/mis-viajes"
              className="font-semibold"
              style={{
                color:
                  "#1D9E75",
              }}
            >
              Mis viajes
            </Link>
            .
          </div>
        )}
      </div>


      {/* CREATE RESERVATION */}

      <BottomSheet
        open={
          confirmSheet
        }
        onClose={() =>
          setConfirmSheet(
            false,
          )
        }
        title="Confirmar reserva"
      >
        <p className="text-[14px] text-[#6B6A66]">
          Vas a reservar 1 asiento por{" "}

          <strong className="text-[#111110]">
            {formatARS(
              trip.pricePerSeat,
            )}
          </strong>
          . El conductor te va a confirmar el viaje.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={
              reservar
            }
            disabled={
              create_reservation_mutation
                .isPending
            }
            className="wayco-btn wayco-btn-primary disabled:opacity-50"
          >
            {create_reservation_mutation
              .isPending
              ? "Reservando…"
              : "Sí, reservar"}
          </button>

          <button
            type="button"
            onClick={() =>
              setConfirmSheet(
                false,
              )
            }
            disabled={
              create_reservation_mutation
                .isPending
            }
            className="wayco-btn wayco-btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </BottomSheet>


      {/* CANCEL RESERVATION */}

      <BottomSheet
        open={
          cancelSheet
        }
        onClose={() =>
          setCancelSheet(
            false,
          )
        }
        title="¿Cancelar reserva?"
      >
        <p className="text-[14px] text-[#6B6A66]">
          Si cancelás, vas a perder el asiento.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={
              cancelarReserva
            }
            disabled={
              cancel_reservation_mutation
                .isPending
            }
            className="wayco-btn wayco-btn-primary disabled:opacity-50"
            style={{
              background:
                "var(--destructive)",
            }}
          >
            {cancel_reservation_mutation
              .isPending
              ? "Cancelando…"
              : "Sí, cancelar"}
          </button>

          <button
            type="button"
            onClick={() =>
              setCancelSheet(
                false,
              )
            }
            disabled={
              cancel_reservation_mutation
                .isPending
            }
            className="wayco-btn wayco-btn-secondary"
          >
            Volver
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}


/* =========================================================
 * PRESENTATION HELPERS
 * ======================================================= */

function Stat({
  value,
  label,
  divider,
}: {
  value:
    string;

  label:
    string;

  divider?:
    boolean;
}) {
  return (
    <div
      className={`text-center ${
        divider
          ? "border-l"
          : ""
      }`}
      style={
        divider
          ? {
              borderColor:
                "#E2E0D8",
            }
          : undefined
      }
    >
      <p className="text-[15px] font-bold text-[#111110]">
        {value}
      </p>

      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#6B6A66]">
        {label}
      </p>
    </div>
  );
}


function RowKV({
  k,
  v,
}: {
  k:
    string;

  v:
    string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#6B6A66]">
        {k}
      </span>

      <span className="font-medium text-[#111110]">
        {v}
      </span>
    </div>
  );
}


function ReservaInfo({
  reserva,
  cbu,
  total,
  onCancel,
}: {
  reserva:
    ReservationForTrip;

  cbu:
    | string
    | null;

  total:
    number;

  onCancel:
    () => void;
}) {
  const labels: Record<
    string,
    {
      label:
        string;

      tone:
        | "success"
        | "warning"
        | "neutral";
    }
  > = {
    pendiente: {
      label:
        "Pendiente de confirmación",

      tone:
        "warning",
    },

    confirmada: {
      label:
        "Confirmada",

      tone:
        "success",
    },

    cancelada: {
      label:
        "Cancelada",

      tone:
        "neutral",
    },

    rechazada: {
      label:
        "Rechazada",

      tone:
        "neutral",
    },
  };


  const status =
    labels[
      reserva.status
    ] ?? {
      label:
        reserva.status,

      tone:
        "neutral" as const,
    };


  return (
    <div
      className="mt-4 rounded-[16px] border bg-white p-5"
      style={{
        borderColor:
          "#E2E0D8",
      }}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6A66]">
        Tu reserva
      </p>

      <p className="mt-1 text-[16px] font-semibold">
        {reserva.seats} asiento
        {reserva.seats >
        1
          ? "s"
          : ""}{" "}
        ·{" "}
        {formatARS(
          total,
        )}
      </p>

      <div className="mt-1.5">
        <TripBadge
          label={
            status.label
          }
          tone={
            status.tone
          }
        />
      </div>

      {(reserva.status ===
        "pendiente" ||
        reserva.status ===
          "confirmada") && (
        <>
          <div
            className="mt-4 rounded-[12px] p-3"
            style={{
              background:
                "#E8F5F0",
            }}
          >
            <p
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{
                color:
                  "#0F6E56",
              }}
            >
              Pagá por transferencia
            </p>

            {cbu ? (
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="break-all font-mono text-[14px]">
                  {cbu}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard
                      .writeText(
                        cbu,
                      );

                    toast.success(
                      "Copiado",
                    );
                  }}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white"
                  aria-label="Copiar"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            ) : (
              <p className="mt-1 text-[13px] text-[#6B6A66]">
                El conductor todavía no cargó su CBU/alias.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={
              onCancel
            }
            className="mt-4 w-full rounded-[10px] border py-2.5 text-[14px] font-medium"
            style={{
              color:
                "var(--destructive)",
            }}
          >
            Cancelar reserva
          </button>
        </>
      )}
    </div>
  );
}