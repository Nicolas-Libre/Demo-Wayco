import {
  createFileRoute,
  Link,
} from "@tanstack/react-router";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  MapPin,
  Star,
} from "lucide-react";

import type {
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

type Ciudad = {
  name: string;
  descripcion: string;
  coords: [number, number];
  principal: boolean;
};

const CIUDADES: Ciudad[] = [
  {
    name: "La Plata",
    descripcion:
      "Buenos Aires, Argentina",
    coords: [
      -34.9205,
      -57.9536,
    ],
    principal: true,
  },

  {
    name: "CABA",
    descripcion:
      "Ciudad Autónoma de Buenos Aires",
    coords: [
      -34.6037,
      -58.3816,
    ],
    principal: true,
  },

  {
    name: "Hudson",
    descripcion:
      "Partido de Berazategui",
    coords: [
      -34.7986,
      -58.1606,
    ],
    principal: false,
  },

  {
    name: "Quilmes",
    descripcion:
      "Partido de Quilmes",
    coords: [
      -34.7203,
      -58.2543,
    ],
    principal: false,
  },

  {
    name: "Berazategui",
    descripcion:
      "Partido de Berazategui",
    coords: [
      -34.7639,
      -58.2125,
    ],
    principal: false,
  },
];

function todayPlus(
  daysToAdd: number,
): Date {
  const date = new Date();

  date.setDate(
    date.getDate() +
      daysToAdd,
  );

  return date;
}

function iso(
  date: Date,
): string {
  return date
    .toISOString()
    .slice(
      0,
      10,
    );
}

function labelDia(
  date: Date,
  index: number,
): string {
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

function BuscarPage() {
  const [
    origen,
    setOrigen,
  ] = useState<Ciudad | null>(
    CIUDADES[0],
  );

  const [
    destino,
    setDestino,
  ] = useState<Ciudad | null>(
    CIUDADES[1],
  );

  const [
    fecha,
    setFecha,
  ] = useState<string>(
    iso(new Date()),
  );

  const [
    searched,
    setSearched,
  ] = useState(false);

  const [
    sheet,
    setSheet,
  ] = useState<
    null | "origen" | "destino"
  >(null);

  const dias =
    useMemo(
      () =>
        Array.from(
          {
            length: 7,
          },
          (
            _,
            index,
          ) =>
            todayPlus(
              index,
            ),
        ),
      [],
    );

  const searchInput =
    useMemo<
      TripSearchParams | null
    >(() => {
      if (
        !searched ||
        !origen ||
        !destino ||
        !fecha
      ) {
        return null;
      }

      return {
        origin:
          origen.name,

        destination:
          destino.name,

        date:
          fecha,
      };
    }, [
      searched,
      origen,
      destino,
      fecha,
    ]);

  const trips_query =
    use_search_trips({
      input:
        searchInput,

      enabled:
        searched,
    });

  const viajes =
    trips_query.data ??
    [];

  const loading =
    trips_query.isPending &&
    searched;

  const puedeBuscar =
    Boolean(
      origen &&
        destino &&
        fecha,
    );

  function handleSearch() {
    if (!puedeBuscar) {
      return;
    }

    setSearched(true);
  }

  function handleResetSearch() {
    setSearched(false);
  }

  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "#F7F7F5",
      }}
    >
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height:
            "45vh",
        }}
      >
        <LeafletMap
          origen={origen}
          destino={destino}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, #F7F7F5 100%)",
          }}
        />
      </div>

      <div className="relative pt-[38vh]">
        <div
          className="rounded-t-[24px] bg-white px-6 pb-32 pt-3"
          style={{
            minHeight:
              "62vh",

            boxShadow:
              "0 -4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <div
            className="mx-auto mb-5 h-1 w-8 rounded-[2px]"
            style={{
              background:
                "#D3D1C7",
            }}
          />

          {!searched ? (
            <>
              <h1
                className="text-[22px] font-bold"
                style={{
                  color:
                    "#111110",
                }}
              >
                ¿A dónde vas?
              </h1>

              <p
                className="mt-1 text-[14px]"
                style={{
                  color:
                    "#6B6A66",
                }}
              >
                Elegí tu ciudad de origen y destino.
              </p>

              <div
                className="mt-5 rounded-[16px] p-4"
                style={{
                  background:
                    "#F2F1ED",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setSheet(
                      "origen",
                    )
                  }
                  className="flex w-full items-center gap-3 py-1 text-left"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background:
                        "#1D9E75",
                    }}
                  />

                  <span
                    className="flex-1 text-[15px] font-semibold"
                    style={{
                      color:
                        origen
                          ? "#111110"
                          : "#9B9A96",
                    }}
                  >
                    {origen?.name ??
                      "¿Desde dónde salís?"}
                  </span>

                  <ChevronDown
                    size={16}
                    color="#6B6A66"
                  />
                </button>

                <div
                  className="my-2 ml-[4px] h-5"
                  style={{
                    borderLeft:
                      "1.5px dashed #D3D1C7",

                    width: 1,
                  }}
                />

                <div
                  style={{
                    borderTop:
                      "1px solid #E8E7E3",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setSheet(
                      "destino",
                    )
                  }
                  className="mt-2 flex w-full items-center gap-3 py-1 text-left"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-[2px]"
                    style={{
                      background:
                        "#111110",
                    }}
                  />

                  <span
                    className="flex-1 text-[15px] font-semibold"
                    style={{
                      color:
                        destino
                          ? "#111110"
                          : "#9B9A96",
                    }}
                  >
                    {destino?.name ??
                      "¿A dónde vas?"}
                  </span>

                  <ChevronDown
                    size={16}
                    color="#6B6A66"
                  />
                </button>
              </div>

              <div className="mt-6">
                <p
                  className="mb-2 text-[11px] font-semibold uppercase tracking-wide"
                  style={{
                    color:
                      "#6B6A66",
                  }}
                >
                  Fecha
                </p>

                <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1">
                  {dias.map(
                    (
                      date,
                      index,
                    ) => {
                      const id =
                        iso(date);

                      const active =
                        id ===
                        fecha;

                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            setFecha(
                              id,
                            )
                          }
                          className="shrink-0 whitespace-nowrap"
                          style={{
                            height:
                              36,

                            borderRadius:
                              20,

                            padding:
                              "0 16px",

                            fontSize:
                              14,

                            fontWeight:
                              active
                                ? 600
                                : 500,

                            background:
                              active
                                ? "#1D9E75"
                                : "#F2F1ED",

                            color:
                              active
                                ? "#FFFFFF"
                                : "#111110",
                          }}
                        >
                          {labelDia(
                            date,
                            index,
                          )}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={
                  handleSearch
                }
                disabled={
                  !puedeBuscar
                }
                className="mt-7 w-full"
                style={{
                  height:
                    52,

                  borderRadius:
                    14,

                  fontSize:
                    15,

                  fontWeight:
                    600,

                  background:
                    puedeBuscar
                      ? "#1D9E75"
                      : "#D3D1C7",

                  color:
                    puedeBuscar
                      ? "#FFFFFF"
                      : "#9B9A96",

                  cursor:
                    puedeBuscar
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                Ver viajes disponibles
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[15px] font-semibold"
                    style={{
                      color:
                        "#111110",
                    }}
                  >
                    {origen?.name} →{" "}
                    {destino?.name}
                  </p>

                  <p
                    className="mt-0.5 text-[12px]"
                    style={{
                      color:
                        "#6B6A66",
                    }}
                  >
                    {fecha} ·{" "}
                    {loading
                      ? "Buscando…"
                      : `${viajes.length} ${
                          viajes.length ===
                          1
                            ? "viaje"
                            : "viajes"
                        }`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleResetSearch
                  }
                  className="text-[13px] font-semibold"
                  style={{
                    color:
                      "#1D9E75",
                  }}
                >
                  Cambiar búsqueda
                </button>
              </div>

              <div className="mt-5 space-y-3">
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
                      background:
                        "#FEF2F2",

                      border:
                        "1px solid #FECACA",
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
                      onClick={() =>
                        trips_query.refetch()
                      }
                      className="mt-3 text-[13px] font-semibold text-red-700"
                    >
                      Reintentar
                    </button>
                  </div>
                ) : viajes.length ===
                  0 ? (
                  <div
                    className="rounded-[16px] p-8 text-center"
                    style={{
                      background:
                        "#F2F1ED",
                    }}
                  >
                    <p
                      className="text-[14px]"
                      style={{
                        color:
                          "#6B6A66",
                      }}
                    >
                      No encontramos viajes para esta ruta y fecha.
                    </p>
                  </div>
                ) : (
                  viajes.map(
                    (trip) => (
                      <ResultCard
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
            </>
          )}
        </div>
      </div>

      <BottomSheet
        open={
          sheet !== null
        }
        onClose={() =>
          setSheet(null)
        }
        title={
          sheet === "origen"
            ? "Elegí el origen"
            : "Elegí el destino"
        }
      >
        <p
          className="-mt-2 mb-4 text-[13px]"
          style={{
            color:
              "#6B6A66",
          }}
        >
          Wayco opera en el corredor La Plata – CABA y zonas
          intermedias.
        </p>

        <div>
          {CIUDADES.map(
            (
              city,
              index,
            ) => {
              const selected =
                sheet ===
                "origen"
                  ? city.name ===
                    origen?.name
                  : city.name ===
                    destino?.name;

              return (
                <button
                  key={
                    city.name
                  }
                  type="button"
                  onClick={() => {
                    if (
                      sheet ===
                      "origen"
                    ) {
                      setOrigen(
                        city,
                      );
                    } else {
                      setDestino(
                        city,
                      );
                    }

                    setSheet(
                      null,
                    );
                  }}
                  className="flex w-full items-center gap-3 py-4 text-left"
                  style={{
                    borderBottom:
                      index <
                      CIUDADES.length -
                        1
                        ? "1px solid #F2F1ED"
                        : "none",
                  }}
                >
                  <MapPin
                    size={18}
                    color={
                      city.principal
                        ? "#1D9E75"
                        : "#9B9A96"
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-[15px] font-semibold"
                      style={{
                        color:
                          "#111110",
                      }}
                    >
                      {city.name}
                    </p>

                    <p
                      className="text-[12px]"
                      style={{
                        color:
                          "#6B6A66",
                      }}
                    >
                      {
                        city.descripcion
                      }
                    </p>
                  </div>

                  {selected && (
                    <span
                      style={{
                        color:
                          "#1D9E75",

                        fontWeight:
                          700,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>

        <p
          className="mt-4 text-center text-[12px] italic"
          style={{
            color:
              "#9B9A96",
          }}
        >
          ¿Tu ciudad no está? Pronto llegamos a más corredores.
        </p>
      </BottomSheet>
    </div>
  );
}

function ResultCard({
  trip,
}: {
  trip: TripSearchResult;
}) {
  return (
    <Link
      to="/viaje/$id"
      params={{
        id:
          trip.id,
      }}
      className="wayco-card block active:scale-[0.99]"
    >
      <div className="flex items-center gap-3">
        <Avatar
          name={
            trip.driver?.name
          }
          size={38}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold">
            {trip.driver?.name ??
              "Conductor"}
          </p>

          {trip.driver
            ?.averageRating !=
            null && (
            <p className="mt-0.5 flex items-center gap-1 text-[12px] text-[var(--text-secondary)]">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />

              {trip.driver.averageRating.toFixed(
                1,
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
          {
            trip.availableSeats
          }{" "}
          libre
          {trip.availableSeats !==
          1
            ? "s"
            : ""}
        </span>

        <p
          className="text-[18px] font-bold"
          style={{
            color:
              "#1D9E75",
          }}
        >
          $
          {trip.pricePerSeat.toLocaleString(
            "es-AR",
          )}
        </p>
      </div>
    </Link>
  );
}

function LeafletMap({
  origen,
  destino,
}: {
  origen: Ciudad | null;
  destino: Ciudad | null;
}) {
  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const mapRef =
    useRef<any>(null);

  const layerRef =
    useRef<any>(null);

  useEffect(() => {
    if (
      typeof window ===
        "undefined" ||
      !containerRef.current
    ) {
      return;
    }

    let cancelled =
      false;

    void (async () => {
      const L =
        (
          await import(
            "leaflet"
          )
        ).default;

      await import(
        "leaflet/dist/leaflet.css"
      );

      if (
        cancelled ||
        !containerRef.current
      ) {
        return;
      }

      if (!mapRef.current) {
        const map =
          L.map(
            containerRef.current,
            {
              center: [
                -34.7,
                -58.2,
              ],

              zoom:
                10,

              minZoom:
                9,

              maxZoom:
                13,

              dragging:
                false,

              scrollWheelZoom:
                false,

              touchZoom:
                false,

              doubleClickZoom:
                false,

              boxZoom:
                false,

              keyboard:
                false,

              zoomControl:
                false,

              attributionControl:
                false,
            },
          );

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom:
              19,
          },
        ).addTo(
          map,
        );

        mapRef.current =
          map;
      }

      const map =
        mapRef.current;

      if (
        layerRef.current
      ) {
        map.removeLayer(
          layerRef.current,
        );

        layerRef.current =
          null;
      }

      const group =
        L.layerGroup().addTo(
          map,
        );

      const makeIcon =
        () =>
          L.divIcon({
            className:
              "wayco-map-pin",

            html:
              '<span style="display:block;width:12px;height:12px;border-radius:50%;background:#1D9E75;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);"></span>',

            iconSize: [
              16,
              16,
            ],

            iconAnchor: [
              8,
              8,
            ],
          });

      const origin =
        origen ??
        CIUDADES[0];

      const destination =
        destino ??
        CIUDADES[1];

      L.marker(
        origin.coords,
        {
          icon:
            makeIcon(),
        },
      ).addTo(
        group,
      );

      L.marker(
        destination.coords,
        {
          icon:
            makeIcon(),
        },
      ).addTo(
        group,
      );

      L.polyline(
        [
          origin.coords,
          destination.coords,
        ],
        {
          color:
            "#1D9E75",

          weight:
            3,

          dashArray:
            "8, 6",

          opacity:
            0.7,
        },
      ).addTo(
        group,
      );

      layerRef.current =
        group;

      map.invalidateSize();
    })();

    return () => {
      cancelled =
        true;
    };
  }, [
    origen,
    destino,
  ]);

  useEffect(() => {
    return () => {
      if (
        mapRef.current
      ) {
        mapRef.current.remove();

        mapRef.current =
          null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{
        background:
          "#04342C",

        filter:
          "saturate(0.4) hue-rotate(100deg) brightness(0.95)",
      }}
    />
  );
}