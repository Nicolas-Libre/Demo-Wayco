import { useState } from "react";

import {
  use_finalize_empty_trip,
  use_rate_trip_participant,
  use_trip_completion,
} from "../hooks/use_trip_completion";

import type {
  TripRatingTarget,
} from "../services/trip_completion_api";

type TripCompletionPanelProps = {
  tripId: string;
  onCompleted?: () => void;
};

const RATING_OPTIONS = [
  { score: 5, label: "Excelente" },
  { score: 4, label: "Bueno" },
  { score: 3, label: "Decente" },
  { score: 2, label: "Malo" },
  { score: 1, label: "Muy malo" },
] as const;

export function TripCompletionPanel({
  tripId,
  onCompleted,
}: TripCompletionPanelProps) {
  const completion = use_trip_completion(tripId);
  const rate = use_rate_trip_participant();
  const finalize = use_finalize_empty_trip();

  const [selectedScores, setSelectedScores] = useState<
    Record<string, number>
  >({});

  const [errorMessage, setErrorMessage] = useState<string | null>(
    null,
  );

  async function handleRate(target: TripRatingTarget) {
    const score = selectedScores[target.id];

    if (!score || rate.isPending || finalize.isPending) {
      return;
    }

    setErrorMessage(null);

    try {
      const result = await rate.mutateAsync({
        trip_id: tripId,
        input: {
          reviewedId: target.id,
          score,
        },
      });

      if (result.status === "finalizado") {
        onCompleted?.();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la calificación.",
      );
    }
  }

  async function handleFinalize() {
    if (finalize.isPending || rate.isPending) {
      return;
    }

    setErrorMessage(null);

    try {
      const result = await finalize.mutateAsync(tripId);

      if (result.status === "finalizado") {
        onCompleted?.();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo finalizar el viaje.",
      );
    }
  }

  if (completion.isLoading) {
    return (
      <p className="text-sm text-gray-500">
        Cargando información del viaje...
      </p>
    );
  }

  if (completion.isError || !completion.data) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">
          No se pudo consultar la finalización del viaje.
        </p>

        <button
          type="button"
          onClick={() => void completion.refetch()}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const trip = completion.data;

  if (trip.status === "finalizado") {
    return (
      <p className="text-sm font-medium text-green-700">
        Este viaje ya fue finalizado.
      </p>
    );
  }

  if (!trip.departurePassed) {
    return (
      <p className="text-sm text-gray-600">
        Las calificaciones estarán disponibles después de la
        hora de salida del viaje.
      </p>
    );
  }

  if (trip.hasPendingReservations) {
    return (
      <p className="text-sm text-amber-700">
        Antes de finalizar el viaje, el conductor debe resolver
        todas las reservas pendientes.
      </p>
    );
  }

  const pendingTargets = trip.targets.filter(
    (target) => target.score === null,
  );

  const hasNoPassengers =
    trip.confirmedPassengers === 0;

  const canFinalizeEmpty =
    hasNoPassengers &&
    trip.requiredRatings === 0;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">
          Finalización del viaje
        </h3>

        <p className="text-sm text-gray-600">
          Calificaciones completadas:{" "}
          {trip.completedRatings} de {trip.requiredRatings}
        </p>
      </div>

      {pendingTargets.map((target) => (
        <div
          key={target.id}
          className="space-y-3 rounded-xl border p-4"
        >
          <div>
            <p className="font-medium">{target.name}</p>

            <p className="text-sm text-gray-500">
              {target.category === "comportamiento"
                ? "Calificá su comportamiento"
                : "Calificá el servicio y la conducción"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {RATING_OPTIONS.map((option) => {
              const selected =
                selectedScores[target.id] === option.score;

              return (
                <button
                  key={option.score}
                  type="button"
                  disabled={rate.isPending}
                  onClick={() =>
                    setSelectedScores((previous) => ({
                      ...previous,
                      [target.id]: option.score,
                    }))
                  }
                  className={[
                    "rounded-lg border px-2 py-3 text-sm transition-colors",
                    selected
                      ? "border-[#1D9E75] bg-[#E8F5F0] font-semibold text-[#0F6E56]"
                      : "border-gray-200 hover:border-[#1D9E75] hover:bg-[#E8F5F0]",
                  ].join(" ")}
                >
                  <span className="block">
                    {option.score} ★
                  </span>

                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={
              !selectedScores[target.id] ||
              rate.isPending ||
              finalize.isPending
            }
            onClick={() => void handleRate(target)}
            className="rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F6E56] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rate.isPending
              ? "Guardando..."
              : "Confirmar calificación"}
          </button>
        </div>
      ))}

      {canFinalizeEmpty && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Este viaje no tiene pasajeros confirmados.
            Podés finalizarlo sin registrar calificaciones.
          </p>

          <button
            type="button"
            disabled={finalize.isPending || rate.isPending}
            onClick={() => void handleFinalize()}
            className="rounded-lg bg-[#1D9E75] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0F6E56] disabled:opacity-50"
          >
            {finalize.isPending
              ? "Finalizando..."
              : "Finalizar viaje"}
          </button>
        </div>
      )}

      {pendingTargets.length === 0 && !canFinalizeEmpty && (
        <p className="text-sm text-gray-600">
          Ya registraste todas tus calificaciones.
          El viaje se finalizará cuando todos los participantes
          hayan completado las suyas.
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}