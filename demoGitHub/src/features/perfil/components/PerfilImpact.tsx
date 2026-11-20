import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Fuel,
  Leaf,
} from "lucide-react";

import {
  formatDecimal,
} from "@/features/trips/utils/trip-formatters";

import { PerfilImpactLabel } from "./PerfilImpactLabel";
import { PerfilImpactStat } from "./PerfilImpactStat";

export function PerfilImpact({
  viajes,
  co2Kg,
}: {
  viajes: number;
  co2Kg: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-[12px]"
      style={{
        background: "#E8F5F0",
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "#1D9E75",
            }}
          >
            <Leaf
              className="h-5 w-5 text-white"
              strokeWidth={2}
            />
          </div>

          <div className="flex-1">
            <p
              className="text-[14px] font-semibold"
              style={{
                color: "#0F6E56",
              }}
            >
              Compartiendo el camino ahorrás CO₂
            </p>

            <p
              className="mt-1 text-[13px]"
              style={{
                color: "#0F6E56",
              }}
            >
              Con tus{" "}
              <strong>
                {viajes}
              </strong>{" "}
              viajes evitaste emitir ~
              <strong>
                {formatDecimal(co2Kg)} kg
              </strong>{" "}
              de CO₂.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold"
          style={{
            color: "#0F6E56",
          }}
          aria-expanded={open}
        >
          {open ? "Menos información" : "Más información"}

          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div
            className="bg-white p-5"
            style={{
              borderTop: "1px solid #9FE1CB",
              borderRadius: "0 0 14px 14px",
            }}
          >
            <PerfilImpactLabel>
              Cómo lo calculamos
            </PerfilImpactLabel>

            <p
              className="mt-2 text-[13px] leading-[1.6]"
              style={{
                color: "#4A4845",
              }}
            >
              Cada vez que completás un viaje compartido en Wayco,
              estimamos las emisiones de CO₂ que evitaste en base a
              tres variables: la distancia del trayecto, el factor de
              emisión del combustible y la cantidad de pasajeros que
              compartieron el auto.
            </p>

            <div
              className="mt-3 rounded-[10px] p-[14px]"
              style={{
                background: "#F2F1ED",
              }}
            >
              <code
                className="block text-[13px]"
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, monospace",
                  color: "#111110",
                }}
              >
                CO₂ evitado = distancia_km × factor_combustible ×
                (pasajeros / (pasajeros + 1))
              </code>
            </div>

            <div
              className="mt-3 space-y-1.5 text-[12px]"
              style={{
                color: "#4A4845",
              }}
            >
              <p>
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, monospace",
                  }}
                >
                  distancia_km
                </span>{" "}
                — kilómetros recorridos en el trayecto
              </p>

              <p>
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, monospace",
                  }}
                >
                  factor_combustible
                </span>{" "}
                — kg de CO₂ por km según tipo de combustible
              </p>

              <p>
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, SFMono-Regular, monospace",
                  }}
                >
                  pasajeros
                </span>{" "}
                — asientos ocupados por pasajeros (sin contar al
                conductor)
              </p>
            </div>

            <div className="mt-6">
              <PerfilImpactLabel>
                Factores de emisión utilizados
              </PerfilImpactLabel>

              <p
                className="mt-2 text-[13px] leading-[1.6]"
                style={{
                  color: "#4A4845",
                }}
              >
                Los factores de emisión que usamos están basados en
                valores de referencia del IPCC (Panel
                Intergubernamental sobre Cambio Climático) y del
                Inventario Nacional de Gases de Efecto Invernadero de
                Argentina (SAyDS).
              </p>

              <div className="mt-3 space-y-2">
                {[
                  {
                    name: "Nafta",
                    valor: "0.192",
                  },
                  {
                    name: "Diésel",
                    valor: "0.209",
                  },
                  {
                    name: "GNC",
                    valor: "0.128",
                  },
                ].map((combustible) => (
                  <div
                    key={combustible.name}
                    className="flex items-center gap-3 rounded-[10px] border bg-white p-3"
                    style={{
                      borderColor: "#E2E0D8",
                    }}
                  >
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        background: "#E8F5F0",
                      }}
                    >
                      <Fuel
                        className="h-4 w-4"
                        style={{
                          color: "#1D9E75",
                        }}
                      />
                    </span>

                    <span className="flex-1 text-[14px] font-medium text-[#111110]">
                      {combustible.name}
                    </span>

                    <span
                      className="text-[14px] font-semibold"
                      style={{
                        color: "#1D9E75",
                      }}
                    >
                      {combustible.valor}
                    </span>

                    <span
                      className="text-[12px]"
                      style={{
                        color: "#6B6A66",
                      }}
                    >
                      kg CO₂ / km*
                    </span>
                  </div>
                ))}
              </div>

              <p
                className="mt-3 text-[10px] italic"
                style={{
                  color: "#9B9A96",
                  lineHeight: 1.6,
                }}
              >
                * Valores calculados para un vehículo promedio de
                1.600 cc con consumo de referencia de 8 L/100km para
                nafta/diésel y 10 m³/100km para GNC. Fuente: IPCC AR6
                (2021) y SAyDS Argentina.
              </p>
            </div>

            <div className="mt-6">
              <PerfilImpactLabel>
                El impacto en números
              </PerfilImpactLabel>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <PerfilImpactStat
                  numero="~11,5 kg"
                  desc="CO₂ emite un auto nafta promedio en el trayecto La Plata–CABA (solo)"
                />

                <PerfilImpactStat
                  numero="~5,3 kg"
                  desc="CO₂ por pasajero cuando viajan 3 personas en el mismo auto"
                />

                <PerfilImpactStat
                  numero="54%"
                  desc="de reducción de emisiones al pasar de viajar solo a compartir con 2 pasajeros"
                  className="col-span-2 sm:col-span-1"
                />
              </div>
            </div>

            <div className="mt-6">
              <PerfilImpactLabel>
                Transparencia sobre nuestro cálculo
              </PerfilImpactLabel>

              <p
                className="mt-2 text-[12px] italic"
                style={{
                  color: "#6B6A66",
                  lineHeight: 1.6,
                }}
              >
                Esta estimación es aproximada. No contempla variables
                como el estado del tráfico en tiempo real, el desgaste
                del motor, el peso total del vehículo ni las
                condiciones climáticas, que pueden aumentar o reducir
                las emisiones reales entre un 10% y un 30%. Wayco
                utiliza estos valores como referencia educativa, no
                como medición certificada de huella de carbono.
              </p>
            </div>

            <div className="mt-6">
              <PerfilImpactLabel>
                Fuentes
              </PerfilImpactLabel>

              <ul
                className="mt-2 space-y-1.5 text-[11px]"
                style={{
                  color: "#9B9A96",
                  lineHeight: 1.8,
                }}
              >
                {[
                  "IPCC Sixth Assessment Report (AR6), 2021 — Capítulo de transporte",
                  "Inventario Nacional de GEI — Secretaría de Ambiente y Desarrollo Sustentable de Argentina",
                  "Agencia Internacional de Energía (IEA) — Emissions from fuel combustion, 2023",
                ].map((source) => (
                  <li
                    key={source}
                    className="flex items-start gap-1.5"
                  >
                    <ExternalLink className="mt-0.5 h-[11px] w-[11px] shrink-0" />

                    <span>
                      {source}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-6 flex w-full items-center justify-center gap-1 text-[13px] font-semibold"
              style={{
                color: "#1D9E75",
              }}
            >
              Menos información

              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}