import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarX } from "lucide-react";

import { AuthShell } from "@/components/layout/AuthShell";
import { TripBadge } from "@/features/trips/components/TripBadge";
import { TripRoute } from "@/features/trips/components/TripRoute";
import { use_trip_history } from "@/features/trips/hooks/use_trip_completion";

import type {
  TripHistoryItem,
} from "@/features/trips/services/trip_completion_api";

export const Route = createFileRoute("/historial-viajes")({
  head: () => ({
    meta: [
      {
        title: "Historial de viajes — Wayco",
      },
    ],
  }),

  component: () => (
    <AuthShell>
      <HistorialViajesPage />
    </AuthShell>
  ),
});

type Tab = "pasajero" | "conductor";

function HistorialViajesPage() {
  const [tab, setTab] = useState<Tab>("pasajero");

  const history_query = use_trip_history();

  const trips = (
    tab === "pasajero"
      ? history_query.data?.passenger
      : history_query.data?.driver
  )?.filter((trip) => trip.status === "finalizado") ?? [];

  return (
    <div className="px-5 pt-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[24px] font-bold text-[#111110]">
          Historial de viajes
        </h1>

        <Link
          to="/mis-viajes"
          className="text-[13px] font-semibold text-[#1D9E75]"
        >
          Mis viajes
        </Link>
      </div>

      <div
        className="mt-5 flex rounded-[10px] p-1"
        style={{ background: "#F2F1ED" }}
      >
        <TabButton
          active={tab === "pasajero"}
          onClick={() => setTab("pasajero")}
        >
          Como pasajero
        </TabButton>

        <TabButton
          active={tab === "conductor"}
          onClick={() => setTab("conductor")}
        >
          Como conductor
        </TabButton>
      </div>

      {history_query.isError && (
        <div className="mt-5 rounded-[12px] border border-red-300 bg-red-50 p-4">
          <p className="text-[13px] font-semibold text-red-700">
            No se pudo cargar el historial
          </p>

          <p className="mt-1 text-[12px] text-red-600">
            {history_query.error.message}
          </p>

          <button
            type="button"
            onClick={() => void history_query.refetch()}
            className="mt-3 text-[13px] font-semibold text-red-700 underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <section className="mt-5 space-y-3">
        {history_query.isPending ? (
          <p className="text-center text-[14px] text-[#6B6A66]">
            Cargando historial…
          </p>
        ) : history_query.isError ? null : trips.length === 0 ? (
          <div
            className="flex flex-col items-center rounded-[16px] border border-dashed p-10 text-center"
            style={{ borderColor: "#E2E0D8" }}
          >
            <CalendarX
              className="h-12 w-12"
              style={{ color: "#D3D1C7" }}
              strokeWidth={1.5}
            />

            <p className="mt-4 text-[14px] text-[#6B6A66]">
              Todavía no tenés viajes finalizados
              {tab === "pasajero"
                ? " como pasajero."
                : " como conductor."}
            </p>
          </div>
        ) : (
          trips.map((trip) => (
            <HistoryTripCard key={trip.id} trip={trip} />
          ))
        )}
      </section>
    </div>
  );
}

function HistoryTripCard({
  trip,
}: {
  trip: TripHistoryItem;
}) {
  return (
    <div
      className="rounded-[16px] border bg-white p-4"
      style={{ borderColor: "#E2E0D8" }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[13px] text-[#6B6A66]">
          {trip.date}
          {" · "}
          {trip.departureTime.slice(0, 5)}
        </p>

        <TripBadge label="Finalizado" tone="neutral" />
      </div>

      <div className="mt-3">
        <TripRoute
          origin={trip.origin}
          destination={trip.destination}
        />
      </div>

      <div
        className="mt-3 border-t pt-3"
        style={{ borderColor: "#F2F1ED" }}
      >
        <Link
          to="/viaje/$id"
          params={{ id: trip.id }}
          className="text-[13px] font-semibold"
          style={{ color: "#1D9E75" }}
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-[8px] py-2 text-[13px] font-semibold transition-all"
      style={{
        background: active ? "white" : "transparent",
        color: active ? "#111110" : "#6B6A66",
        boxShadow: active
          ? "0 1px 3px rgba(0,0,0,0.08)"
          : undefined,
      }}
    >
      {children}
    </button>
  );
}