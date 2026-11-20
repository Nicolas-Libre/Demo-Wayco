import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Star,
  Users,
} from "lucide-react";

import { TripBadge } from "./TripBadge";
import { TripRoute } from "./TripRoute";
import type { TripCardData } from "../types/trip-card.types";
import {
  formatAvailableSeats,
  formatDecimal,
  formatTripPrice,
  getDriverInitial,
} from "../utils/trip-formatters";

type TripCardProps = {
  trip: TripCardData;
  to?: string;
};

export function TripCard({
  trip,
  to = "/viaje/$id",
}: TripCardProps) {
  const driverInitial = getDriverInitial(
    trip.conductorNombre,
    trip.conductorInicial,
  );

  const driverColor =
    trip.conductorColor ?? "#1D9E75";

  return (
    <Link
      to={to}
      params={{ id: trip.id }}
      className="block rounded-[16px] border bg-white p-4 transition-transform active:scale-[0.99]"
      style={{
        borderColor: "#E2E0D8",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[16px] font-semibold text-white"
          style={{ background: driverColor }}
          aria-hidden
        >
          {driverInitial}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-[15px] font-semibold text-[#111110]">
              {trip.conductorNombre}
            </p>

            {trip.rating != null && (
              <span className="flex items-center gap-0.5 text-[13px] text-[#6B6A66]">
                <Star className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                {formatDecimal(trip.rating)}
              </span>
            )}

            {trip.viajesConductor != null && (
              <span className="text-[12px] text-[#6B6A66]">
                · {trip.viajesConductor} viajes
              </span>
            )}
          </div>

          {trip.vehiculo && (
            <p className="mt-0.5 truncate text-[12px] text-[#6B6A66]">
              {trip.vehiculo}
            </p>
          )}
        </div>
      </div>

      {trip.badge && (
        <div className="mt-3">
          <TripBadge
            label={trip.badge.label}
            tone={trip.badge.tone}
          />
        </div>
      )}

      <div
        className="mt-4 border-t pt-4"
        style={{ borderColor: "#F2F1ED" }}
      >
        <TripRoute
          origin={trip.origen}
          destination={trip.destino}
          time={trip.hora}
          durationMinutes={trip.duracionMin}
        />
      </div>

      <div
        className="mt-4 flex items-center justify-between border-t pt-3"
        style={{ borderColor: "#F2F1ED" }}
      >
        <span className="inline-flex items-center gap-1.5 text-[13px] text-[#6B6A66]">
          <Users
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />

          {formatAvailableSeats(
            trip.asientosDisponibles,
          )}
        </span>

        <span className="flex items-center gap-1">
          <span
            className="text-[20px] font-bold"
            style={{ color: "#1D9E75" }}
          >
            ${formatTripPrice(trip.precio)}
          </span>

          <ChevronRight className="h-4 w-4 text-[#D3D1C7]" />
        </span>
      </div>
    </Link>
  );
}