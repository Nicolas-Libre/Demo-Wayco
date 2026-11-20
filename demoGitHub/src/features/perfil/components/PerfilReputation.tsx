import { useState } from "react";

import { Info, X } from "lucide-react";

import {
  SectionHeader,
} from "@/components/layout/SectionHeader";

import {
  use_user_reputation,
} from "@/features/users/hooks/use_user_reputation";

import {
  formatDecimal,
} from "@/features/trips/utils/trip-formatters";

import {
  PerfilStat,
} from "./PerfilStat";

export function PerfilReputation() {
  const reputation_query = use_user_reputation();

  const [showCreditsInfo, setShowCreditsInfo] =
    useState(false);

  const credits = reputation_query.data?.credits ?? 0;

  return (
    <>
      <section className="px-5 pt-7">
        {/* ENCABEZADO */}

        <div className="flex items-center justify-between gap-3">
          <SectionHeader>
            Reputación ({credits}{" "}
            {credits === 1 ? "crédito" : "créditos"})
          </SectionHeader>

          <button
            type="button"
            onClick={() => setShowCreditsInfo(true)}
            aria-label="Información sobre los créditos"
            title="Información sobre los créditos"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6B6A66] transition-colors hover:bg-[#E8F5F0] hover:text-[#1D9E75]"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        {/* ESTADO DE CARGA */}

        {reputation_query.isPending ? (
          <p className="text-[13px] text-[#6B6A66]">
            Cargando reputación…
          </p>
        ) : reputation_query.isError ? (
          /* ESTADO DE ERROR */

          <div className="rounded-[12px] border border-red-300 bg-red-50 p-4">
            <p className="text-[13px] text-red-700">
              No se pudo cargar tu reputación.
            </p>

            <button
              type="button"
              onClick={() => void reputation_query.refetch()}
              className="mt-2 text-[13px] font-semibold text-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : (
          /* ESTADÍSTICAS */

          <div className="grid grid-cols-2 overflow-hidden rounded-[12px] border border-[#E2E0D8] bg-white">
            <PerfilStat
              value={
                reputation_query.data.driverRating === null
                  ? "—"
                  : `★ ${formatDecimal(
                      reputation_query.data.driverRating,
                    )}`
              }
              label="Score conductor"
            />

            <PerfilStat
              value={
                reputation_query.data.passengerRating === null
                  ? "—"
                  : `★ ${formatDecimal(
                      reputation_query.data.passengerRating,
                    )}`
              }
              label="Score pasajero"
              divider
            />

            <div className="border-t border-[#E2E0D8]">
              <PerfilStat
                value={String(
                  reputation_query.data.driverTrips,
                )}
                label="Viajes conductor"
              />
            </div>

            <div className="border-t border-[#E2E0D8]">
              <PerfilStat
                value={String(
                  reputation_query.data.passengerTrips,
                )}
                label="Viajes pasajero"
                divider
              />
            </div>
          </div>
        )}
      </section>

      {/* VENTANA INFORMATIVA */}

      {showCreditsInfo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-5"
          onClick={() => setShowCreditsInfo(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="credits-info-title"
            className="w-full max-w-[420px] rounded-[16px] bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* ENCABEZADO DE LA VENTANA */}

            <div className="flex items-center justify-between gap-3">
              <h2
                id="credits-info-title"
                className="text-[18px] font-bold text-[#111110]"
              >
                Créditos Wayco
              </h2>

              <button
                type="button"
                onClick={() => setShowCreditsInfo(false)}
                aria-label="Cerrar información"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B6A66] hover:bg-[#F2F1ED]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* SALDO */}

            <div className="mt-5 rounded-[12px] bg-[#E8F5F0] p-4 text-center">
              <p className="text-[12px] font-medium text-[#0F6E56]">
                Tus créditos actuales
              </p>

              <p className="mt-1 text-[30px] font-bold text-[#1D9E75]">
                {credits}
              </p>

              <p className="text-[12px] text-[#0F6E56]">
                {credits === 1 ? "crédito" : "créditos"}
              </p>
            </div>

            {/* EXPLICACIÓN */}

            <div className="mt-5 space-y-4">
              <div>
                <h3 className="text-[14px] font-semibold text-[#111110]">
                  ¿Cómo gano créditos?
                </h3>

                <p className="mt-1 text-[13px] leading-relaxed text-[#6B6A66]">
                  Cuando viajás como pasajero, podés
                  calificar tu experiencia con el
                  conductor una vez finalizado el viaje.
                </p>

                <p className="mt-2 text-[13px] leading-relaxed text-[#6B6A66]">
                  Por cada calificación que realizás
                  manualmente, obtenés{" "}
                  <span className="font-semibold text-[#1D9E75]">
                    1 crédito Wayco
                  </span>
                  .
                </p>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-[#111110]">
                  ¿Qué pasa si no califico?
                </h3>

                <p className="mt-1 text-[13px] leading-relaxed text-[#6B6A66]">
                  Tenés 2 horas desde la finalización
                  del viaje para calificar.
                  Si no lo hacés, se asignan
                  automáticamente 5 estrellas al
                  conductor, pero no obtenés créditos.
                </p>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-[#111110]">
                  ¿Para qué sirven?
                </h3>

                <p className="mt-1 text-[13px] leading-relaxed text-[#6B6A66]">
                  Los créditos se acumulan en tu cuenta.
                  Próximamente podrán utilizarse en un
                  sistema de recompensas y beneficios
                  de Wayco.
                </p>
              </div>
            </div>

            {/* BOTÓN CERRAR */}

            <button
              type="button"
              onClick={() => setShowCreditsInfo(false)}
              className="mt-6 w-full rounded-[12px] bg-[#1D9E75] py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#178563]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}