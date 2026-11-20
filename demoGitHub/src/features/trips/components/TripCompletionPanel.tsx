import {
  useState,
} from "react";

import {
  use_rate_trip_participant,
  use_trip_completion,
} from "../hooks/use_trip_completion";

import type {
  TripRatingTarget,
} from "../services/trip_completion_api";

/* =========================================================
 * TYPES
 * ======================================================= */

type TripCompletionPanelProps = {
  tripId: string;
  onCompleted?: () => void;
};

type StarRatingProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

/* =========================================================
 * CONSTANTS
 * ======================================================= */

const STAR_LABELS: Record<number, string> = {
  1: "Muy malo",
  2: "Malo",
  3: "Regular",
  4: "Bueno",
  5: "Excelente",
};

const RATING_PERIOD_MS =
  2 * 60 * 60 * 1000;

/* =========================================================
 * DATE HELPERS
 * ======================================================= */

function formatArgentinaDateTime(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return date.toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getEstimatedArrival(
  ratingDeadline: string | null,
): string | null {
  if (!ratingDeadline) {
    return null;
  }

  const deadline = new Date(
    ratingDeadline,
  ).getTime();

  if (!Number.isFinite(deadline)) {
    return null;
  }

  return new Date(
    deadline - RATING_PERIOD_MS,
  ).toISOString();
}

/* =========================================================
 * STAR RATING
 * ======================================================= */

function StarRating({
  value,
  onChange,
  disabled = false,
}: StarRatingProps) {
  const [
    hovered,
    setHovered,
  ] = useState<number | null>(null);

  const activeValue = hovered ?? value;

  return (
    <div className="space-y-2">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHovered(null)}
        role="group"
        aria-label="Seleccionar calificación"
      >
        {[1, 2, 3, 4, 5].map((score) => {
          const active =
            score <= activeValue;

          return (
            <button
              key={score}
              type="button"
              disabled={disabled}
              onMouseEnter={() =>
                setHovered(score)
              }
              onFocus={() =>
                setHovered(score)
              }
              onBlur={() =>
                setHovered(null)
              }
              onClick={() =>
                onChange(score)
              }
              aria-label={`${score} ${
                score === 1
                  ? "estrella"
                  : "estrellas"
              }`}
              aria-pressed={
                value === score
              }
              className={[
                "rounded-md p-1 transition-transform",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#1D9E75]",
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:scale-110",
              ].join(" ")}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill={
                  active
                    ? "#F5B301"
                    : "none"
                }
                stroke={
                  active
                    ? "#F5B301"
                    : "#9CA3AF"
                }
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path
                  d="M12 2.5 14.9 8.4 21.4 9.35 16.7 13.95 17.8 20.45 12 17.35 6.2 20.45 7.3 13.95 2.6 9.35 9.1 8.4 12 2.5Z"
                />
              </svg>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-gray-500">
        {activeValue > 0
          ? `${activeValue} ${
              activeValue === 1
                ? "estrella"
                : "estrellas"
            } · ${STAR_LABELS[activeValue]}`
          : "Seleccioná de 1 a 5 estrellas"}
      </p>
    </div>
  );
}

/* =========================================================
 * RATING CARD
 * ======================================================= */

type RatingCardProps = {
  target: TripRatingTarget;
  selectedScore: number;
  onSelectScore: (score: number) => void;
  onConfirm: () => void;
  isPending: boolean;
  isPassenger: boolean;
};

function RatingCard({
  target,
  selectedScore,
  onSelectScore,
  onConfirm,
  isPending,
  isPassenger,
}: RatingCardProps) {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="space-y-1">
        <p className="text-base font-semibold text-gray-900">
          Calificá tu experiencia con{" "}
          {target.name}
        </p>

        <p className="text-sm text-gray-500">
          Tu calificación es opcional.
        </p>
      </div>

      <StarRating
        value={selectedScore}
        onChange={onSelectScore}
        disabled={isPending}
      />

      {isPassenger && (
        <div className="rounded-lg bg-[#E8F5F0] px-3 py-2">
          <p className="text-sm font-medium text-[#0F6E56]">
            Ganá 1 crédito calificando
            al conductor.
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={
          !selectedScore ||
          isPending
        }
        onClick={onConfirm}
        className={[
          "rounded-lg bg-[#1D9E75]",
          "px-4 py-2 text-sm font-medium text-white",
          "transition-colors hover:bg-[#0F6E56]",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
        ].join(" ")}
      >
        {isPending
          ? "Guardando..."
          : "Confirmar calificación"}
      </button>
    </div>
  );
}

/* =========================================================
 * REGISTERED RATING
 * ======================================================= */

type RegisteredRatingProps = {
  target: TripRatingTarget;
};

function RegisteredRating({
  target,
}: RegisteredRatingProps) {
  const score = target.score ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm font-medium text-gray-900">
        {target.name}
      </p>

      <p
        className="mt-1 text-sm text-amber-500"
        aria-label={`${score} de 5 estrellas`}
      >
        {"★".repeat(score)}
        {"☆".repeat(5 - score)}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {target.isAutomatic
          ? "Calificación automática"
          : "Tu calificación"}
      </p>
    </div>
  );
}

/* =========================================================
 * MAIN COMPONENT
 * ======================================================= */

export function TripCompletionPanel({
  tripId,
  onCompleted,
}: TripCompletionPanelProps) {
  const completion =
    use_trip_completion(tripId);

  const rate =
    use_rate_trip_participant();

  const [
    selectedScores,
    setSelectedScores,
  ] = useState<Record<string, number>>({});

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  /* =======================================================
   * REGISTER RATING
   * ===================================================== */

  async function handleRate(
    target: TripRatingTarget,
  ) {
    const score =
      selectedScores[target.id];

    if (
      !score ||
      rate.isPending
    ) {
      return;
    }

    setErrorMessage(null);

    try {
      const result =
        await rate.mutateAsync({
          trip_id: tripId,
          input: {
            reviewedId: target.id,
            score,
          },
        });

      setSelectedScores((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[target.id];

        return updated;
      });

      if (
        result.status === "finalizado"
      ) {
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

  /* =======================================================
   * LOADING
   * ===================================================== */

  if (completion.isLoading) {
    return (
      <p className="text-sm text-gray-500">
        Cargando información del viaje...
      </p>
    );
  }

  if (
    completion.isError ||
    !completion.data
  ) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-red-600">
          No se pudo consultar la
          información del viaje.
        </p>

        <button
          type="button"
          onClick={() =>
            void completion.refetch()
          }
          className="rounded-lg border px-4 py-2 text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  /* =======================================================
   * TRIP DATA
   * ===================================================== */

  const trip = completion.data;

  const isFinalized =
    trip.status === "finalizado";

  const isCancelled =
    trip.status === "cancelado";

  const isActive =
    trip.status === "activo";

  const estimatedArrivalAt =
    getEstimatedArrival(
      trip.ratingDeadline,
    );

  const now = Date.now();

  const estimatedArrivalTime =
    estimatedArrivalAt
      ? new Date(
          estimatedArrivalAt,
        ).getTime()
      : null;

  const deadlineTime =
    trip.ratingDeadline
      ? new Date(
          trip.ratingDeadline,
        ).getTime()
      : null;

  const arrivalPassed =
    estimatedArrivalTime !== null &&
    now >= estimatedArrivalTime;

  const deadlinePassed =
    deadlineTime !== null &&
    now >= deadlineTime;

  const isBeforeDeparture =
    !trip.departurePassed;

  const isTraveling =
    isActive &&
    trip.departurePassed &&
    !arrivalPassed;

  const isWaitingForRatings =
    isActive &&
    arrivalPassed &&
    !deadlinePassed;

  const isAwaitingAutomaticClosure =
    isActive &&
    deadlinePassed;

  const pendingTargets =
    trip.targets.filter(
      (target) =>
        target.score === null,
    );

  const ratedTargets =
    trip.targets.filter(
      (target) =>
        target.score !== null,
    );

  const canRate =
    isActive &&
    trip.ratingPeriodOpen &&
    !deadlinePassed;

  const hasCompletedOwnRatings =
    pendingTargets.length === 0;

  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div className="space-y-5">
      {/* ================================================
          HEADER
         ================================================ */}

      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          Estado del viaje
        </h3>

        {isFinalized && (
          <p className="text-sm font-medium text-[#0F6E56]">
            Este viaje finalizó
            correctamente.
          </p>
        )}

        {isCancelled && (
          <p className="text-sm font-medium text-red-600">
            Este viaje fue cancelado.
          </p>
        )}

        {isBeforeDeparture && isActive && (
          <p className="text-sm text-gray-600">
            El viaje todavía no comenzó.
          </p>
        )}

        {isTraveling && (
          <p className="text-sm text-gray-600">
            El viaje está en curso.
          </p>
        )}

        {isWaitingForRatings && (
          <p className="text-sm font-medium text-[#0F6E56]">
            Pendiente de calificaciones
          </p>
        )}

        {isAwaitingAutomaticClosure && (
          <p className="text-sm font-medium text-gray-600">
            El período de calificación
            terminó. Estamos actualizando
            el estado del viaje.
          </p>
        )}
      </div>

      {/* ================================================
          BEFORE DEPARTURE
         ================================================ */}

      {isBeforeDeparture && isActive && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            Podrás calificar tu experiencia
            cuando el viaje alcance su
            hora estimada de llegada.
          </p>

          {estimatedArrivalAt && (
            <p className="mt-2 text-sm font-medium text-gray-900">
              Llegada estimada:{" "}
              {formatArgentinaDateTime(
                estimatedArrivalAt,
              )}
            </p>
          )}
        </div>
      )}

      {/* ================================================
          TRIP IN PROGRESS
         ================================================ */}

      {isTraveling && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-600">
            Las calificaciones se
            habilitarán automáticamente
            al llegar a la hora estimada
            de finalización del recorrido.
          </p>

          {estimatedArrivalAt && (
            <p className="mt-2 text-sm font-medium text-gray-900">
              Llegada estimada:{" "}
              {formatArgentinaDateTime(
                estimatedArrivalAt,
              )}
            </p>
          )}
        </div>
      )}

      {/* ================================================
          MISSING ROUTE DURATION
         ================================================ */}

      {isActive &&
        !estimatedArrivalAt && (
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-sm text-amber-800">
              No se pudo determinar
              la llegada estimada de
              este viaje.
            </p>
          </div>
        )}

      {/* ================================================
          RATING PERIOD
         ================================================ */}

      {canRate && (
        <div className="space-y-2 rounded-xl bg-[#E8F5F0] p-4">
          <p className="text-sm font-semibold text-[#0F6E56]">
            Calificaciones disponibles
          </p>

          <p className="text-sm text-[#0F6E56]">
            Tenés hasta 2 horas desde
            la llegada estimada para
            calificar voluntariamente
            a los participantes.
          </p>

          {trip.ratingDeadline && (
            <p className="text-xs text-[#0F6E56]">
              Fecha límite:{" "}
              {formatArgentinaDateTime(
                trip.ratingDeadline,
              )}
            </p>
          )}
        </div>
      )}

      {/* ================================================
          PENDING RATINGS
         ================================================ */}

      {canRate &&
        pendingTargets.map(
          (target) => (
            <RatingCard
              key={target.id}
              target={target}
              selectedScore={
                selectedScores[
                  target.id
                ] ?? 0
              }
              onSelectScore={(
                score,
              ) =>
                setSelectedScores(
                  (previous) => ({
                    ...previous,
                    [target.id]:
                      score,
                  }),
                )
              }
              onConfirm={() =>
                void handleRate(
                  target,
                )
              }
              isPending={
                rate.isPending
              }
              isPassenger={
                !trip.isDriver
              }
            />
          ),
        )}

      {/* ================================================
          OWN RATINGS COMPLETED
         ================================================ */}

      {isWaitingForRatings &&
        hasCompletedOwnRatings &&
        trip.targets.length > 0 && (
          <div className="rounded-xl bg-[#E8F5F0] p-4">
            <p className="text-sm font-medium text-[#0F6E56]">
              Ya registraste todas
              tus calificaciones.
            </p>

            <p className="mt-1 text-sm text-[#0F6E56]">
              El viaje finalizará
              automáticamente cuando
              todos los participantes
              hayan calificado o
              cuando venza el plazo.
            </p>
          </div>
        )}

      {/* ================================================
          REGISTERED RATINGS
         ================================================ */}

      {ratedTargets.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900">
            Calificaciones registradas
          </p>

          {ratedTargets.map(
            (target) => (
              <RegisteredRating
                key={target.id}
                target={target}
              />
            ),
          )}
        </div>
      )}

      {/* ================================================
          RATING DEADLINE EXPIRED
         ================================================ */}

      {isAwaitingAutomaticClosure && (
        <div className="rounded-xl bg-gray-100 p-4">
          <p className="text-sm text-gray-600">
            El plazo de 2 horas
            para calificar ya terminó.
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Las calificaciones pendientes
            se completarán
            automáticamente con
            cinco estrellas.
          </p>
        </div>
      )}

      {/* ================================================
          FINALIZED TRIP
         ================================================ */}

      {isFinalized && (
        <div className="rounded-xl bg-[#E8F5F0] p-4">
          <p className="text-sm font-semibold text-[#0F6E56]">
            Viaje finalizado
          </p>

          <p className="mt-1 text-sm text-[#0F6E56]">
            El período de calificación
            de este viaje está cerrado.
          </p>

          {ratedTargets.some(
            (target) =>
              target.isAutomatic,
          ) && (
            <p className="mt-2 text-sm text-[#0F6E56]">
              Las calificaciones que
              no se registraron dentro
              del plazo se completaron
              automáticamente con
              cinco estrellas.
            </p>
          )}
        </div>
      )}

      {/* ================================================
          ERRORS
         ================================================ */}

      {errorMessage && (
        <p
          role="alert"
          className="text-sm text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}