import {
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AlertCircle,
  Car,
  Check,
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  X,
} from "lucide-react";

import {
  toast,
} from "sonner";

import type {
  TripLocationPoint,
  TripPricePreviewInput,
  TripRouteSnapshot,
} from "@wayco/shared/trips";

import type {
  MyVehicle,
} from "@wayco/shared/vehicles";

import {
  AuthShell,
} from "@/components/layout/AuthShell";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

import {
  Slider,
} from "@/components/ui/slider";

import {
  GeoPermissionSheet,
} from "@/features/geolocation/components/GeoPermissionSheet";

import {
  LocationPickerSheet,
} from "@/features/maps/components/LocationPickerSheet";

import {
  RoutePreviewSheet,
} from "@/features/maps/components/RoutePreviewSheet";

import {
  use_compute_route,
} from "@/features/maps/hooks/use_compute_route";

import {
  WAYCO_AREAS,
  type WaycoArea,
} from "@/features/maps/config/wayco_areas";

import {
  use_create_trip,
} from "@/features/trips/hooks/use_create_trip";

import {
  use_trip_price_preview,
} from "@/features/trips/hooks/use_trip_price_preview";

import {
  use_current_user,
} from "@/features/users/hooks/use_current_user";

import {
  PaymentAliasSheet,
} from "@/features/users/components/PaymentAliasSheet";

import {
  AddVehicleSheet,
} from "@/features/vehicles/components/AddVehicleSheet";

import {
  VehicleValidationBadge,
} from "@/features/vehicles/components/VehicleValidationBadge";

import {
  use_my_vehicles,
} from "@/features/vehicles/hooks/use_my_vehicles";

import {
  formatARS,
} from "@/lib/formatters/currency";

import {
  formatDecimal,
} from "@/features/trips/utils/trip-formatters";





export const Route =
  createFileRoute(
    "/publicar",
  )({
    head: () => ({
      meta: [
        {
          title:
            "Publicar viaje — Wayco",
        },
      ],
    }),

    component: () => (
      <AuthShell>
        <GeoPermissionSheet
          scope="publicar"
        />

        <PublicarPage />
      </AuthShell>
    ),
  });


function PublicarPage() {
  const navigate =
    useNavigate();


  /* =======================================================
   * USER
   * ===================================================== */

  const current_user_query =
    use_current_user();

  const current_user =
    current_user_query.data ??
    null;

  const hasPaymentAlias =
    Boolean(
      current_user?.cbuAlias
        ?.trim(),
    );


  /* =======================================================
   * VEHICLES
   * ===================================================== */

  const vehicles_query =
    use_my_vehicles();

  const vehicles =
    vehicles_query.data ??
    [];

  const create_trip_mutation =
    use_create_trip();


  /* =======================================================
   * GENERAL LOCATIONS
   * ===================================================== */

  const [
    origen,
    setOrigen,
  ] =
    useState<WaycoArea | null>(
      WAYCO_AREAS[0] ??
        null,
    );

  const [
    destino,
    setDestino,
  ] =
    useState<WaycoArea | null>(
      WAYCO_AREAS[1] ??
        null,
    );


  /* =======================================================
   * EXACT LOCATIONS
   * ===================================================== */

  const [
    originPoint,
    setOriginPoint,
  ] =
    useState<
      TripLocationPoint | null
    >(
      null,
    );

  const [
    destinationPoint,
    setDestinationPoint,
  ] =
    useState<
      TripLocationPoint | null
    >(
      null,
    );
  /* =======================================================
 * REAL LOCALITIES
 * ===================================================== */

  const originLocality =
    originPoint?.locality?.trim() ||
    origen?.name ||
    null;

  const destinationLocality =
    destinationPoint?.locality?.trim() ||
    destino?.name ||
    null;

  const [
    tripRoute,
    setTripRoute,
  ] =
    useState<
      TripRouteSnapshot | null
    >(
      null,
    );


  const compute_route_mutation =
    use_compute_route();

  const [
  routePreviewOpen,
  setRoutePreviewOpen,
] =
  useState(
    false,
  );

  /* =======================================================
   * EXACT ROUTE
   * ===================================================== */

  useEffect(() => {
    if (
      !originPoint ||
      !destinationPoint
    ) {
      setTripRoute(
        null,
      );

      return;
    }

    let cancelled =
      false;

    void compute_route_mutation
      .mutateAsync({
        origin: {
          lat:
            originPoint.lat,

          lng:
            originPoint.lng,
        },

        destination: {
          lat:
            destinationPoint.lat,

          lng:
            destinationPoint.lng,
        },
      })
      .then(
        (
          route,
        ) => {
          if (
            cancelled
          ) {
            return;
          }

          setTripRoute(
            route,
          );
        },
      )
      .catch(
        () => {
          if (
            cancelled
          ) {
            return;
          }

          setTripRoute(
            null,
          );
        },
      );

    return () => {
      cancelled =
        true;
    };
  }, [
    originPoint?.lat,
    originPoint?.lng,
    destinationPoint?.lat,
    destinationPoint?.lng,
  ]);


  /* =======================================================
   * LOCATION SHEETS
   * ===================================================== */

  const [
    locationSheet,
    setLocationSheet,
  ] =
    useState<
      null |
      "origen" |
      "destino"
    >(
      null,
    );

  const [
    pointPicker,
    setPointPicker,
  ] =
    useState<
      null |
      "origen" |
      "destino"
    >(
      null,
    );


  /* =======================================================
   * TRIP FORM
   * ===================================================== */

  const [
    fecha,
    setFecha,
  ] =
    useState(
      "",
    );

  const [
    hora,
    setHora,
  ] =
    useState(
      "08:00",
    );

  const [
    asientos,
    setAsientos,
  ] =
    useState(
      3,
    );

  const [
    notas,
    setNotas,
  ] =
    useState(
      "",
    );

  const [
    paradas,
    setParadas,
  ] =
    useState<string[]>(
      [],
    );

  const [
    acepta,
    setAcepta,
  ] =
    useState(
      false,
    );

  const [
    resumenAbierto,
    setResumenAbierto,
  ] =
    useState(
      false,
    );


  /* =======================================================
   * OTHER SHEETS
   * ===================================================== */

  const [
    vehicleId,
    setVehicleId,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    vehicleSheetOpen,
    setVehicleSheetOpen,
  ] =
    useState(
      false,
    );

  const [
    blockedSheetOpen,
    setBlockedSheetOpen,
  ] =
    useState(
      false,
    );

  const [
    paymentAliasSheetOpen,
    setPaymentAliasSheetOpen,
  ] =
    useState(
      false,
    );
  const [
  addPaymentAliasSheetOpen,
  setAddPaymentAliasSheetOpen,
] =
  useState(
    false,
  );

  const [
    timeSheetOpen,
    setTimeSheetOpen,
  ] =
    useState(
      false,
    );

  const [
    addVehicleSheetOpen,
    setAddVehicleSheetOpen,
  ] =
    useState(
      false,
    );

  const [
    finalPrice,
    setFinalPrice,
  ] =
    useState<
      number | null
    >(
      null,
    );


  /* =======================================================
   * DAYS
   * ===================================================== */

  const days =
    useMemo(
      () => {
        const result: {
          iso:
            string;

          day:
            string;

          number:
            string;
        }[] = [];


        const weekdayNames = [
          "Dom",
          "Lun",
          "Mar",
          "Mié",
          "Jue",
          "Vie",
          "Sáb",
        ];


        for (
          let offset = 0;
          offset < 7;
          offset += 1
        ) {
          const date =
            new Date();


          date.setDate(
            date.getDate() +
              offset,
          );


          result.push({
            iso:
              date
                .toISOString()
                .slice(
                  0,
                  10,
                ),

            day:
              offset === 0
                ? "Hoy"
                : weekdayNames[
                    date.getDay()
                  ] ?? "",

            number:
              String(
                date.getDate(),
              ).padStart(
                2,
                "0",
              ),
          });
        }


        return result;
      },
      [],
    );


  useEffect(() => {
    if (
      !fecha &&
      days.length > 0
    ) {
      setFecha(
        days[0]
          ?.iso ??
          "",
      );
    }
  }, [
    days,
    fecha,
  ]);


  /* =======================================================
   * AUTO SELECT APPROVED VEHICLE
   * ===================================================== */

  useEffect(() => {
    if (
      vehicleId
    ) {
      return;
    }


    const firstApprovedVehicle =
      vehicles.find(
        (
          vehicle,
        ) =>
          vehicle.validationState ===
          "aprobado",
      );


    if (
      firstApprovedVehicle
    ) {
      setVehicleId(
        firstApprovedVehicle.id,
      );
    }
  }, [
    vehicleId,
    vehicles,
  ]);


  /* =======================================================
   * NO VEHICLES
   * ===================================================== */

  useEffect(() => {
    if (
      vehicles_query.isSuccess &&
      vehicles.length === 0
    ) {
      setAddVehicleSheetOpen(
        true,
      );
    }
  }, [
    vehicles_query.isSuccess,
    vehicles.length,
  ]);


  /* =======================================================
   * CLEAN INVALID SELECTED VEHICLE
   * ===================================================== */

  useEffect(() => {
    if (
      !vehicleId
    ) {
      return;
    }


    const selectedVehicleStillExists =
      vehicles.some(
        (
          vehicle,
        ) =>
          vehicle.id ===
          vehicleId,
      );


    if (
      !selectedVehicleStillExists
    ) {
      setVehicleId(
        null,
      );
    }
  }, [
    vehicleId,
    vehicles,
  ]);


  const selectedVehicle =
    vehicles.find(
      (
        vehicle,
      ) =>
        vehicle.id ===
        vehicleId,
    ) ??
    null;


  /* =======================================================
   * PRICE PREVIEW
   *
   * Por ahora continúa usando las zonas generales.
   * La ruta exacta de Google se incorporará en el
   * siguiente bloque.
   * ===================================================== */

  const pricePreviewInput =
    useMemo<
      TripPricePreviewInput | null
    >(
      () => {
        if (
          !selectedVehicle ||
          selectedVehicle.validationState !==
            "aprobado" ||
          !originLocality ||
          !destinationLocality ||
          originLocality === destinationLocality ||
          !tripRoute ||
          !fecha ||
          !hora
        ) {
          return null;
        }


        return {
  origin: originLocality,
  destination: destinationLocality,

  originPoint: originPoint ?? undefined,
  destinationPoint: destinationPoint ?? undefined,

  route: tripRoute,

          date:
            fecha,

          departureTime:
            hora,

          passengerCount:
            asientos,

          vehicleId:
            selectedVehicle.id,
        };
      },
      [
        selectedVehicle,
        originLocality,
        destinationLocality,
        originPoint,
        destinationPoint,
        tripRoute,
        fecha,
        hora,
        asientos,
      ]
    );


  const price_preview_query =
    use_trip_price_preview({
      input:
        pricePreviewInput,
    });


  const pricePreview =
    price_preview_query.data ??
    null;


  useEffect(() => {
    if (
      pricePreview
    ) {
      setFinalPrice(
        pricePreview
          .pricing
          .suggestedPricePerPassenger,
      );

      return;
    }


    setFinalPrice(
      null,
    );
  }, [
    pricePreview
      ?.pricing
      .suggestedPricePerPassenger,
  ]);


  /* =======================================================
   * SUBMIT
   *
   * Todavía NO enviamos originPoint /
   * destinationPoint porque falta route.
   * ===================================================== */

  async function handleSubmit() {
    if (
      !current_user_query.isPending &&
      !hasPaymentAlias
    ) {
      setPaymentAliasSheetOpen(
        true,
      );

      return;
    }


    if (
      !originLocality ||
      !destinationLocality ||
      !fecha ||
      !hora ||
      !selectedVehicle ||
      !pricePreview ||
      finalPrice === null
    ) {
      toast.error(
        "Completá todos los campos y esperá a que se calcule el precio.",
      );

      return;
    }


    if (originLocality === destinationLocality) {
      toast.error("El origen y el destino deben ser distintos.");
      return;
    }


    if (
      !acepta
    ) {
      toast.error(
        "Aceptá el precio calculado por Wayco.",
      );

      return;
    }


    if (
      selectedVehicle.validationState !==
      "aprobado"
    ) {
      setBlockedSheetOpen(
        true,
      );

      return;
    }

    if (
      !originPoint ||
      !destinationPoint ||
      !tripRoute ||
      compute_route_mutation.isPending
    ) {
      toast.error(
        "Seleccioná los puntos exactos de origen y destino y esperá a que se calcule la ruta.",
      );

      return;
    }
    const routeExpiresAt =
      tripRoute.signedRoute?.payload.expiresAt;

    if (
      !routeExpiresAt ||
      routeExpiresAt <= Date.now() + 30_000
    ) {
      toast.info(
        "La ruta venció. Estamos actualizando el recorrido y el precio.",
      );

      setTripRoute(null);
      setFinalPrice(null);

      try {
        const refreshedRoute =
          await compute_route_mutation.mutateAsync({
            origin: {
              lat: originPoint.lat,
              lng: originPoint.lng,
            },
            destination: {
              lat: destinationPoint.lat,
              lng: destinationPoint.lng,
            },
          });

        setTripRoute(refreshedRoute);

        toast.success(
          "Ruta actualizada. Revisá y confirmá el precio antes de publicar.",
        );
      } catch {
        toast.error(
          "No se pudo actualizar la ruta. Intentá nuevamente.",
        );
      }

      return;
    }
    try {
      const createdTrip =
        await create_trip_mutation
          .mutateAsync({
            origin: originLocality,
            destination: destinationLocality,

            date:
              fecha,

            departureTime:
              hora,

            totalSeats:
              asientos,

            vehicleId:
              selectedVehicle.id,

            selectedPricePerSeat:
              finalPrice,

            originPoint:
              originPoint,

            destinationPoint:
              destinationPoint,

            route:
              tripRoute,

            stops:
              paradas
                .map(
                  (
                    stop,
                  ) =>
                    stop.trim(),
                )
                .filter(
                  Boolean,
                ),

            notes:
              notas.trim() ||
              null,
          });


      toast.success(
        "¡Viaje publicado!",
      );


      void navigate({
        to:
          "/viaje/$id",

        params: {
          id:
            createdTrip.id,
        },
      });
    } catch (
      error
    ) {
      toast.error(
        error instanceof
        Error
          ? error.message
          : "No se pudo publicar el viaje.",
      );
    }
  }


  /* =======================================================
   * VEHICLE SELECTOR
   * ===================================================== */

  function openVehicleSelector() {
    if (
      vehicles_query.isPending
    ) {
      return;
    }


    if (
      vehicles.length === 0
    ) {
      setAddVehicleSheetOpen(
        true,
      );

      return;
    }


    setVehicleSheetOpen(
      true,
    );
  }


  function selectVehicle(
    vehicle:
      MyVehicle,
  ) {
    if (
      vehicle.validationState !==
      "aprobado"
    ) {
      return;
    }


    setVehicleId(
      vehicle.id,
    );

    setVehicleSheetOpen(
      false,
    );
  }


  const hasApprovedVehicles =
    vehicles.some(
      (
        vehicle,
      ) =>
        vehicle.validationState ===
        "aprobado",
    );


  /* =======================================================
   * RENDER
   * ===================================================== */

  return (
    <div className="px-5 pb-10 pt-6">
      <h1 className="text-[24px] font-bold text-[#111110]">
        Publicar viaje
      </h1>

      <p className="mt-1 text-[13px] text-[#6B6A66]">
        El precio lo calcula Wayco según el trayecto y tu vehículo.
      </p>


      {/* ===================================================
       * PAYMENT DATA WARNING
       * ================================================= */}

      {!current_user_query.isPending &&
        !hasPaymentAlias && (
          <div
            className="mt-5 rounded-[14px] border p-4"
            style={{
              background:
                "#FEF9C3",

              borderColor:
                "#FDE68A",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className="mt-0.5 size-5 shrink-0"
                style={{
                  color:
                    "#92400E",
                }}
              />

              <div className="min-w-0 flex-1">
                <p
                  className="text-[14px] font-semibold"
                  style={{
                    color:
                      "#92400E",
                  }}
                >
                  Necesitás cargar tu alias
                </p>

                <p
                  className="mt-1 text-[12px] leading-[1.5]"
                  style={{
                    color:
                      "#92400E",
                  }}
                >
                  Para publicar viajes necesitás tener un CBU o
                  alias configurado para recibir las transferencias
                  de los pasajeros.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setAddPaymentAliasSheetOpen(
                      true,
                    )
                  }
                  className="mt-3 text-[13px] font-semibold"
                  style={{
                    color:
                      "#0F6E56",
                  }}
                >
                  Cargar alias →
                </button>
              </div>
            </div>
          </div>
        )}


      {/* ===================================================
       * VEHICLE ERROR
       * ================================================= */}

      {vehicles_query.isError && (
        <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4">
          <p className="text-[13px] font-semibold text-red-700">
            No se pudieron cargar tus vehículos
          </p>

          <p className="mt-1 text-[12px] text-red-600">
            {
              vehicles_query
                .error
                .message
            }
          </p>

          <button
            type="button"
            onClick={() => {
              void vehicles_query
                .refetch();
            }}
            className="mt-3 text-[13px] font-semibold text-red-700"
          >
            Reintentar
          </button>
        </div>
      )}


      <div className="mt-6 space-y-5">
        {/* =================================================
         * ORIGIN
         * =============================================== */}

        <Field label="Origen">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                setLocationSheet(
                  "origen",
                )
              }
              className="wayco-input flex items-center justify-between text-left"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    background:
                      "#1D9E75",
                  }}
                />

                <span className="truncate">
                  {originLocality ?? "Elegí el origen"}
                </span>
              </span>

              <ChevronDown className="size-4 shrink-0 text-[#6B6A66]" />
            </button>


            {origen && (
              <button
                type="button"
                onClick={() =>
                  setPointPicker(
                    "origen",
                  )
                }
                className={`w-full rounded-[12px] border p-3 text-left transition ${
                  originPoint
                    ? "border-[#9FE1CB] bg-[#E8F5F0]"
                    : "border-dashed border-[#9FE1CB] bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#1D9E75]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[#0F6E56]">
                      {originPoint
                        ? "Punto exacto seleccionado"
                        : "Seleccionar punto exacto"}
                    </p>

                    {originPoint ? (
                      <p className="mt-1 line-clamp-2 text-[12px] leading-[1.4] text-[#111110]">
                        {
                          originPoint.address
                        }
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] leading-[1.4] text-[#6B6A66]">
                        Elegí en el mapa desde dónde vas a salir.
                      </p>
                    )}
                  </div>

                  {originPoint && (
                    <span className="shrink-0 text-[11px] font-semibold text-[#1D9E75]">
                      Cambiar
                    </span>
                  )}
                </div>
              </button>
            )}
          </div>
        </Field>


        {/* =================================================
         * DESTINATION
         * =============================================== */}

        <Field label="Destino">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                setLocationSheet(
                  "destino",
                )
              }
              className="wayco-input flex items-center justify-between text-left"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{
                    background:
                      "#111110",
                  }}
                />

                <span className="truncate">
                  {destinationLocality ?? "Elegí el destino"}
                </span>
              </span>

              <ChevronDown className="size-4 shrink-0 text-[#6B6A66]" />
            </button>


            {destino && (
              <button
                type="button"
                onClick={() =>
                  setPointPicker(
                    "destino",
                  )
                }
                className={`w-full rounded-[12px] border p-3 text-left transition ${
                  destinationPoint
                    ? "border-[#D3D1C7] bg-[#F2F1ED]"
                    : "border-dashed border-[#D3D1C7] bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#111110]" />

                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-[#111110]">
                      {destinationPoint
                        ? "Punto exacto seleccionado"
                        : "Seleccionar punto exacto"}
                    </p>

                    {destinationPoint ? (
                      <p className="mt-1 line-clamp-2 text-[12px] leading-[1.4] text-[#111110]">
                        {
                          destinationPoint.address
                        }
                      </p>
                    ) : (
                      <p className="mt-1 text-[11px] leading-[1.4] text-[#6B6A66]">
                        Elegí en el mapa dónde termina el viaje.
                      </p>
                    )}
                  </div>

                  {destinationPoint && (
                    <span className="shrink-0 text-[11px] font-semibold text-[#111110]">
                      Cambiar
                    </span>
                  )}
                </div>
              </button>
            )}
          </div>
        </Field>


        {/* =================================================
         * EXACT ROUTE STATUS
         * =============================================== */}

        {originPoint &&
          destinationPoint && (
            <div className="rounded-[14px] border border-[#9FE1CB] bg-[#E8F5F0] p-4">
              {compute_route_mutation.isPending ? (
                <>
                  <p className="text-[13px] font-semibold text-[#0F6E56]">
                    Calculando ruta…
                  </p>

                  <p className="mt-1 text-[12px] text-[#6B6A66]">
                    Wayco está consultando Google Maps con los puntos exactos seleccionados.
                  </p>
                </>
              ) : compute_route_mutation.isError ? (
                <>
                  <p className="text-[13px] font-semibold text-red-700">
                    No se pudo calcular la ruta
                  </p>

                  <p className="mt-1 text-[12px] text-red-600">
                    {compute_route_mutation.error instanceof Error
                      ? compute_route_mutation.error.message
                      : "Google Maps no pudo calcular la ruta seleccionada."}
                  </p>
                </>
              ) : tripRoute ? (
  <>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[13px] font-semibold text-[#0F6E56]">
          Ruta calculada
        </p>

        <p className="mt-1 text-[12px] text-[#111110]">
          {formatDecimal(tripRoute.distanceMeters / 1000)} km ·{" "}
          {Math.ceil(tripRoute.durationSeconds / 60)} min
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          setRoutePreviewOpen(
            true,
          )
        }
        className="shrink-0 rounded-[10px] border border-[#1D9E75] bg-white px-3 py-2 text-[12px] font-semibold text-[#0F6E56] transition-colors duration-200 hover:bg-[#1D9E75] hover:text-white"
      >
        Ver ruta
      </button>
    </div>
  </>
) : null}
            </div>
          )}


        {/* =================================================
         * DATE
         * =============================================== */}

        <div>
          <span className="wayco-input-label">
            Fecha
          </span>

          <div className="-mx-1 mt-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {days.map(
              (
                day,
              ) => {
                const active =
                  day.iso ===
                  fecha;


                return (
                  <button
                    key={
                      day.iso
                    }
                    type="button"
                    onClick={() =>
                      setFecha(
                        day.iso,
                      )
                    }
                    className="flex size-[60px] shrink-0 flex-col items-center justify-center rounded-[14px] text-center"
                    style={{
                      background:
                        active
                          ? "#1D9E75"
                          : "#F2F1ED",

                      color:
                        active
                          ? "white"
                          : "#111110",
                    }}
                  >
                    <span className="text-[10px] font-medium uppercase">
                      {day.day}
                    </span>

                    <span className="text-[18px] font-bold">
                      {day.number}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>


        {/* =================================================
         * TIME
         * =============================================== */}

        <Field label="Hora de salida">
          <button
            type="button"
            onClick={() =>
              setTimeSheetOpen(
                true,
              )
            }
            className="wayco-input flex items-center justify-between text-left"
          >
            <span>
              {hora} hs
            </span>

            <ChevronDown className="size-4 text-[#6B6A66]" />
          </button>
        </Field>


        {/* =================================================
         * SEATS
         * =============================================== */}

        <div>
          <span className="wayco-input-label">
            Asientos disponibles
          </span>

          <div className="mt-1 flex h-[52px] items-center justify-between rounded-[12px] bg-[#F2F1ED] px-4">
            <Stepper
              button="-"
              disabled={
                asientos <=
                1
              }
              onClick={() =>
                setAsientos(
                  (
                    current,
                  ) =>
                    Math.max(
                      1,
                      current -
                        1,
                    ),
                )
              }
            />

            <span className="text-[18px] font-bold text-[#111110]">
              {asientos}
            </span>

            <Stepper
              button="+"
              disabled={
                asientos >=
                3
              }
              onClick={() =>
                setAsientos(
                  (
                    current,
                  ) =>
                    Math.min(
                      3,
                      current +
                        1,
                    ),
                )
              }
            />
          </div>
        </div>


        {/* =================================================
         * VEHICLE
         * =============================================== */}

        <Field label="Vehículo">
          <button
            type="button"
            onClick={
              openVehicleSelector
            }
            disabled={
              vehicles_query.isPending
            }
            className="wayco-input flex items-center justify-between text-left disabled:cursor-wait disabled:opacity-60"
          >
            <span className="flex min-w-0 items-center gap-2 truncate">
              <Car className="size-4 shrink-0 text-[#0F6E56]" />

              <span className="truncate">
                {vehicles_query.isPending
                  ? "Cargando vehículos..."
                  : selectedVehicle
                    ? formatVehicleName(
                        selectedVehicle,
                      )
                    : "Seleccioná un vehículo"}
              </span>
            </span>

            <ChevronDown className="size-4 shrink-0 text-[#6B6A66]" />
          </button>


          {!vehicles_query.isPending &&
            vehicles.length >
              0 &&
            !hasApprovedVehicles && (
              <p className="mt-2 text-[12px] leading-[1.4] text-[#92400E]">
                No tenés vehículos aprobados para publicar un viaje.
                Podés consultar su estado desde el selector.
              </p>
            )}
        </Field>


        {/* =================================================
         * PRICE LOADING
         * =============================================== */}

        {price_preview_query.isPending &&
          pricePreviewInput && (
            <div className="rounded-[14px] border border-[#9FE1CB] bg-[#E8F5F0] p-4">
              <div className="h-3 w-48 animate-pulse rounded bg-[#9FE1CB]/50" />

              <div className="mt-3 h-8 w-32 animate-pulse rounded bg-[#9FE1CB]/50" />

              <div className="mt-4 h-4 w-full animate-pulse rounded bg-[#9FE1CB]/40" />
            </div>
          )}


        {/* =================================================
         * PRICE ERROR
         * =============================================== */}

        {price_preview_query.isError && (
          <div className="rounded-[14px] border border-red-300 bg-red-50 p-4">
            <p className="text-[13px] font-semibold text-red-700">
              No se pudo calcular el precio
            </p>

            <p className="mt-1 text-[12px] text-red-600">
              {
                price_preview_query
                  .error
                  .message
              }
            </p>

            <button
              type="button"
              onClick={() => {
                void price_preview_query
                  .refetch();
              }}
              className="mt-3 text-[13px] font-semibold text-red-700"
            >
              Reintentar
            </button>
          </div>
        )}


        {/* =================================================
         * PRICE
         * =============================================== */}

        {pricePreview &&
          finalPrice !==
            null && (
            <div
              className="rounded-[14px] p-4"
              style={{
                background:
                  "#E8F5F0",

                border:
                  "1px solid #9FE1CB",
              }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{
                  color:
                    "#0F6E56",
                }}
              >
                Precio sugerido por pasajero
              </p>


              <div className="mt-1 flex flex-wrap items-baseline gap-2">
                <span
                  className="text-[28px] font-bold"
                  style={{
                    color:
                      "#1D9E75",
                  }}
                >
                  {formatARS(
                    finalPrice,
                  )}
                </span>

                <span className="text-[11px] text-[#6B6A66]">
                  Rango:{" "}
                  {formatARS(
                    pricePreview
                      .pricing
                      .minimumPricePerPassenger,
                  )}{" "}
                  –{" "}
                  {formatARS(
                    pricePreview
                      .pricing
                      .maximumPricePerPassenger,
                  )}
                </span>
              </div>


              <div className="mt-3">
                <Slider
                  min={
                    pricePreview
                      .pricing
                      .minimumPricePerPassenger
                  }
                  max={
                    pricePreview
                      .pricing
                      .maximumPricePerPassenger
                  }
                  step={
                    1
                  }
                  value={[
                    finalPrice,
                  ]}
                  onValueChange={(
                    value,
                  ) => {
                    const nextPrice =
                      value[0];


                    if (
                      nextPrice !==
                      undefined
                    ) {
                      setFinalPrice(
                        nextPrice,
                      );
                    }
                  }}
                />


                <div className="mt-1 flex justify-between text-[11px] text-[#6B6A66]">
                  <span>
                    {formatARS(
                      pricePreview
                        .pricing
                        .minimumPricePerPassenger,
                    )}
                  </span>

                  <span>
                    {formatARS(
                      pricePreview
                        .pricing
                        .suggestedPricePerPassenger,
                    )}
                  </span>

                  <span>
                    {formatARS(
                      pricePreview
                        .pricing
                        .maximumPricePerPassenger,
                    )}
                  </span>
                </div>
              </div>


              <div
                className="mt-4 border-t pt-3"
                style={{
                  borderColor:
                    "rgba(15,110,86,0.2)",
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B6A66]">
                  Desglose del costo
                </p>


                <div className="mt-2 space-y-1 text-[13px] text-[#111110]">
                  <Row
                    label={`Combustible (${formatDecimal(pricePreview.route.distanceKm)} km)`}
                    value={
                      formatARS(
                        pricePreview
                          .pricing
                          .fuelCost,
                      )
                    }
                  />

                  <Row
                    label="Peaje"
                    value={
                      formatARS(
                        pricePreview
                          .pricing
                          .tollCost,
                      )
                    }
                  />

                  <Row
                    label="Desgaste del auto"
                    value={
                      formatARS(
                        pricePreview
                          .pricing
                          .totalWearCost,
                      )
                    }
                  />


                  <div
                    className="mt-1.5 flex items-center justify-between border-t pt-1.5"
                    style={{
                      borderColor:
                        "rgba(15,110,86,0.15)",
                    }}
                  >
                    <span className="font-semibold">
                      Total del recorrido
                    </span>

                    <span className="font-semibold">
                      {formatARS(
                        pricePreview
                          .pricing
                          .totalTripCost,
                      )}
                    </span>
                  </div>
                </div>
              </div>


              <div className="mt-3 rounded-[10px] bg-white/60 p-3">
                <p className="text-[13px] font-semibold text-[#0F6E56]">
                  ✓ Vos pagás{" "}
                  {formatARS(
                    pricePreview
                      .pricing
                      .driverSharedCost,
                  )}
                </p>

                <p className="mt-0.5 text-[11px] text-[#6B6A66]">
                  Tu parte del combustible y peaje. El desgaste lo cubren los
                  pasajeros.
                </p>
              </div>
            </div>
          )}


        {/* =================================================
         * STOPS
         * =============================================== */}

        <div>
          <span className="wayco-input-label">
            Paradas opcionales
          </span>

          <div className="mt-1 space-y-2">
            {paradas.map(
              (
                stop,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="flex items-center gap-2"
                >
                  <input
                    className="wayco-input flex-1"
                    value={
                      stop
                    }
                    placeholder={`Parada ${index + 1}`}
                    onChange={(
                      event,
                    ) =>
                      setParadas(
                        paradas.map(
                          (
                            currentStop,
                            currentIndex,
                          ) =>
                            index ===
                            currentIndex
                              ? event
                                  .target
                                  .value
                              : currentStop,
                        ),
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setParadas(
                        paradas.filter(
                          (
                            _,
                            currentIndex,
                          ) =>
                            currentIndex !==
                            index,
                        ),
                      )
                    }
                    className="inline-flex size-10 items-center justify-center rounded-full bg-[#F2F1ED]"
                    aria-label="Quitar parada"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ),
            )}


            {paradas.length <
              3 && (
              <button
                type="button"
                onClick={() =>
                  setParadas([
                    ...paradas,
                    "",
                  ])
                }
                className="inline-flex items-center gap-2 text-[13px] font-semibold"
                style={{
                  color:
                    "#1D9E75",
                }}
              >
                <Plus className="size-4" />

                Agregar parada
              </button>
            )}
          </div>
        </div>


        {/* =================================================
         * NOTES
         * =============================================== */}

        <Field label="Notas (opcional)">
          <textarea
            className="wayco-input"
            rows={
              3
            }
            placeholder="Salgo desde diagonal 74, paso por estación de servicio…"
            value={
              notas
            }
            onChange={(
              event,
            ) =>
              setNotas(
                event.target.value,
              )
            }
            style={{
              resize:
                "none",

              height:
                "auto",

              minHeight:
                80,
            }}
          />
        </Field>


        {/* =================================================
         * SUMMARY
         * =============================================== */}

        {pricePreview &&
          selectedVehicle && (
            <div
              className="rounded-[14px] border bg-white"
              style={{
                borderColor:
                  "#E2E0D8",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setResumenAbierto(
                    (
                      current,
                    ) =>
                      !current,
                  )
                }
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <span className="text-[14px] font-semibold text-[#111110]">
                  Resumen del viaje
                </span>

                <ChevronDown
                  className={`size-5 text-[#6B6A66] transition-transform ${
                    resumenAbierto
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>


              {resumenAbierto && (
                <div
                  className="space-y-1 border-t px-4 py-3 text-[13px] text-[#111110]"
                  style={{
                    borderColor:
                      "#F2F1ED",
                  }}
                >
                  <Row
                    label="Origen"
                    value={originLocality ?? "-"}
                  />


                  {originPoint && (
                    <Row
                      label="Punto de salida"
                      value={
                        originPoint
                          .address
                      }
                    />
                  )}


                  <Row
                    label="Destino"
                    value={destinationLocality ?? "-"}
                  />


                  {destinationPoint && (
                    <Row
                      label="Punto de llegada"
                      value={
                        destinationPoint
                          .address
                      }
                    />
                  )}


                  {paradas
                    .map(
                      (
                        stop,
                      ) =>
                        stop.trim(),
                    )
                    .filter(
                      Boolean,
                    )
                    .map(
                      (
                        stop,
                        index,
                      ) => (
                        <Row
                          key={`${stop}-${index}`}
                          label={`Parada ${index + 1}`}
                          value={
                            stop
                          }
                        />
                      ),
                    )}


                  <Row
                    label="Fecha"
                    value={
                      fecha
                    }
                  />

                  <Row
                    label="Hora"
                    value={`${hora} hs`}
                  />

                  <Row
                    label="Asientos"
                    value={
                      String(
                        asientos,
                      )
                    }
                  />

                  <Row
                    label="Vehículo"
                    value={
                      formatVehicleName(
                        selectedVehicle,
                      )
                    }
                  />

                  <Row
                    label="Precio por pasajero"
                    value={
                      formatARS(
                        finalPrice ??
                          pricePreview
                            .pricing
                            .suggestedPricePerPassenger,
                      )
                    }
                  />
                </div>
              )}
            </div>
          )}


        {/* =================================================
         * PRICE ACCEPTANCE
         * =============================================== */}

        <label className="flex cursor-pointer items-start gap-3 rounded-[12px] bg-[#F2F1ED] p-4">
          <input
            type="checkbox"
            checked={
              acepta
            }
            onChange={(
              event,
            ) =>
              setAcepta(
                event.target.checked,
              )
            }
            className="sr-only"
          />

          <span
            className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border"
            style={{
              background:
                acepta
                  ? "#1D9E75"
                  : "white",

              borderColor:
                acepta
                  ? "#1D9E75"
                  : "#D3D1C7",
            }}
            aria-hidden
          >
            {acepta && (
              <Check
                className="size-3.5 text-white"
                strokeWidth={
                  3
                }
              />
            )}
          </span>

          <span className="text-[13px] text-[#111110]">
            Entiendo que el precio es calculado por Wayco y no puede
            modificarse.
          </span>
        </label>


        {/* =================================================
         * SUBMIT
         * =============================================== */}

        <button
          type="button"
          onClick={
            handleSubmit
          }
          disabled={
            current_user_query.isPending ||
            !originPoint ||
            !destinationPoint ||
            !tripRoute ||
            compute_route_mutation.isPending ||
            !acepta ||
            !pricePreview ||
            finalPrice ===
              null ||
            !selectedVehicle ||
            selectedVehicle.validationState !==
              "aprobado" ||
            price_preview_query.isPending ||
            create_trip_mutation.isPending
          }
          className="wayco-btn wayco-btn-primary disabled:opacity-50"
        >
          {create_trip_mutation.isPending
            ? "Publicando…"
            : price_preview_query.isPending
              ? "Calculando precio…"
              : "Publicar viaje"}
        </button>
      </div>


      {/* ===================================================
       * GENERAL LOCATION SHEET
       * ================================================= */}

      <BottomSheet
        open={
          locationSheet !==
          null
        }
        onClose={() =>
          setLocationSheet(
            null,
          )
        }
        title={
          locationSheet ===
          "origen"
            ? "Elegí el origen"
            : "Elegí el destino"
        }
      >
        <p className="-mt-2 mb-4 text-[13px] text-[#6B6A66]">
          Wayco opera en el corredor La Plata – CABA y zonas
          intermedias.
        </p>


        <div>
          {WAYCO_AREAS.map(
            (
              city,
              index,
            ) => {
              const selected =
                locationSheet ===
                "origen"
                  ? city.name ===
                    origen?.name
                  : city.name ===
                    destino?.name;


              const disabled =
                locationSheet ===
                "origen"
                  ? city.name ===
                    destino?.name
                  : city.name ===
                    origen?.name;


              return (
                <button
                  key={
                    city.name
                  }
                  type="button"
                  disabled={
                    disabled
                  }
                  onClick={() => {
                    const target =
                      locationSheet;


                    if (
                      target ===
                      "origen"
                    ) {
                      const changed =
                        origen?.name !==
                        city.name;


                      setOrigen(
                        city,
                      );


                      if (
                        changed
                      ) {
                        setTripRoute(
                          null,
                        );

                        setOriginPoint(
                          null,
                        );
                      }
                    }


                    if (
                      target ===
                      "destino"
                    ) {
                      const changed =
                        destino?.name !==
                        city.name;


                      setDestino(
                        city,
                      );


                      if (
                        changed
                      ) {
                        setTripRoute(
                          null,
                        );

                        setDestinationPoint(
                          null,
                        );
                      }
                    }


                    setLocationSheet(
                      null,
                    );


                    if (
                      target
                    ) {
                      setPointPicker(
                        target,
                      );
                    }
                  }}
                  className={`flex w-full items-center gap-3 py-4 text-left ${
                    disabled
                      ? "cursor-not-allowed opacity-40"
                      : ""
                  }`}
                  style={{
                    borderBottom:
                      index <
                      WAYCO_AREAS.length -
                        1
                        ? "1px solid #F2F1ED"
                        : "none",
                  }}
                >
                  <MapPin
                    size={
                      18
                    }
                    color={
                      city.principal
                        ? "#1D9E75"
                        : "#9B9A96"
                    }
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-[#111110]">
                      {
                        city.name
                      }
                    </p>

                    <p className="text-[12px] text-[#6B6A66]">
                      {
                        city.description
                      }
                    </p>
                  </div>


                  {selected && (
                    <span className="font-bold text-[#1D9E75]">
                      ✓
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
      </BottomSheet>


      {/* ===================================================
       * ORIGIN MAP
       * ================================================= */}

      <LocationPickerSheet
        open={
          pointPicker ===
          "origen"
        }
        type="origin"
        area={
          origen
        }
        initialPoint={
          originPoint
        }
        onClose={() =>
          setPointPicker(
            null,
          )
        }
        onConfirm={(
          point,
        ) => {
          setTripRoute(
            null,
          );

          setOriginPoint(
            point,
          );

          setPointPicker(
            null,
          );
        }}
      />


      {/* ===================================================
       * DESTINATION MAP
       * ================================================= */}

      <LocationPickerSheet
        open={
          pointPicker ===
          "destino"
        }
        type="destination"
        area={
          destino
        }
        initialPoint={
          destinationPoint
        }
        onClose={() =>
          setPointPicker(
            null,
          )
        }
        onConfirm={(
          point,
        ) => {
          setTripRoute(
            null,
          );

          setDestinationPoint(
            point,
          );

          setPointPicker(
            null,
          );
        }}
      />

      {/* ===================================================
 * ROUTE PREVIEW
 * ================================================= */}

{originPoint &&
  destinationPoint &&
  tripRoute && (
    <RoutePreviewSheet
  open={
    routePreviewOpen
  }
  origin={
    originPoint
  }
  destination={
    destinationPoint
  }
  route={
    tripRoute
  }
  onClose={() =>
    setRoutePreviewOpen(
      false,
    )
  }
  onChangeOrigin={() => {
    setRoutePreviewOpen(
      false,
    );

    setPointPicker(
      "origen",
    );
  }}
  onChangeDestination={() => {
    setRoutePreviewOpen(
      false,
    );

    setPointPicker(
      "destino",
    );
  }}
/>
  )}

      {/* ===================================================
       * TIME SHEET
       * ================================================= */}

      <BottomSheet
        open={
          timeSheetOpen
        }
        onClose={() =>
          setTimeSheetOpen(
            false,
          )
        }
        title="Hora de salida"
      >
        <div className="max-h-[50vh] overflow-y-auto">
          {generateTimes().map(
            (
              time,
            ) => (
              <button
                key={
                  time
                }
                type="button"
                onClick={() => {
                  setHora(
                    time,
                  );

                  setTimeSheetOpen(
                    false,
                  );
                }}
                className="flex w-full items-center justify-between rounded-[10px] px-4 py-3 text-left text-[15px] hover:bg-[#F2F1ED]"
                style={{
                  color:
                    time ===
                    hora
                      ? "#1D9E75"
                      : "#111110",

                  fontWeight:
                    time ===
                    hora
                      ? 600
                      : 400,
                }}
              >
                <span>
                  {time} hs
                </span>

                {time ===
                  hora && (
                  <Check className="size-4" />
                )}
              </button>
            ),
          )}
        </div>
      </BottomSheet>


      {/* ===================================================
       * VEHICLE SHEET
       * ================================================= */}

      <BottomSheet
        open={
          vehicleSheetOpen
        }
        onClose={() =>
          setVehicleSheetOpen(
            false,
          )
        }
        title="Seleccioná tu vehículo"
      >
        <div className="space-y-2">
          {vehicles.map(
            (
              vehicle,
            ) => {
              const isApproved =
                vehicle.validationState ===
                "aprobado";


              const isSelected =
                vehicle.id ===
                vehicleId;


              return (
                <button
                  key={
                    vehicle.id
                  }
                  type="button"
                  disabled={
                    !isApproved
                  }
                  onClick={() =>
                    selectVehicle(
                      vehicle,
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-[12px] bg-[#F2F1ED] p-4 text-left transition-opacity ${
                    isApproved
                      ? ""
                      : "cursor-not-allowed opacity-60"
                  }`}
                  aria-label={
                    isApproved
                      ? `Seleccionar ${formatVehicleName(
                          vehicle,
                        )}`
                      : `${formatVehicleName(
                          vehicle,
                        )} no está habilitado para publicar`
                  }
                >
                  <Car
                    className={`size-5 shrink-0 ${
                      isApproved
                        ? "text-[#0F6E56]"
                        : "text-[#6B6A66]"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-[#111110]">
                      {formatVehicleName(
                        vehicle,
                      )}
                    </p>

                    <p className="mt-0.5 text-[12px] text-[#6B6A66]">
                      {
                        vehicle.fuelType
                      }{" "}
                      ·{" "}
                      {formatDecimal(vehicle.consumptionL100Km)}
                      L/100km{" "}
                      {
                        vehicle.licensePlate
                      }
                    </p>

                    <div className="mt-1.5">
                      <VehicleValidationBadge
                        status={
                          vehicle.validationState
                        }
                      />
                    </div>


                    {!isApproved && (
                      <p className="mt-1.5 text-[11px] text-[#6B6A66]">
                        {getUnavailableVehicleMessage(
                          vehicle,
                        )}
                      </p>
                    )}
                  </div>


                  {isSelected &&
                    isApproved && (
                      <Check className="size-5 shrink-0 text-[#1D9E75]" />
                    )}
                </button>
              );
            },
          )}


          <button
            type="button"
            onClick={() => {
              setVehicleSheetOpen(
                false,
              );

              setAddVehicleSheetOpen(
                true,
              );
            }}
            className="flex w-full items-center gap-3 rounded-[12px] border-2 border-dashed p-4 text-left text-[14px] font-semibold"
            style={{
              borderColor:
                "#9FE1CB",

              color:
                "#1D9E75",
            }}
          >
            <Plus className="size-5" />

            Agregar nuevo vehículo
          </button>
        </div>
      </BottomSheet>


      {/* ===================================================
       * ADD VEHICLE
       * ================================================= */}

      <AddVehicleSheet
        open={
          addVehicleSheetOpen
        }
        onClose={() =>
          setAddVehicleSheetOpen(
            false,
          )
        }
        onCreated={() => {
          setAddVehicleSheetOpen(
            false,
          );
        }}
      />


      {/* ===================================================
       * BLOCKED VEHICLE
       * ================================================= */}

      <BottomSheet
        open={
          blockedSheetOpen
        }
        onClose={() =>
          setBlockedSheetOpen(
            false,
          )
        }
        title="Tu vehículo está siendo revisado"
      >
        <div className="space-y-4">
          <div
            className="flex items-start gap-2.5 rounded-[12px] p-3.5"
            style={{
              background:
                "#FEF9C3",

              border:
                "1px solid #FDE68A",
            }}
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              style={{
                color:
                  "#92400E",
              }}
            />

            <p
              className="text-[13px] leading-[1.5]"
              style={{
                color:
                  "#92400E",
              }}
            >
              Podrás publicar viajes cuando el equipo de Wayco apruebe
              la documentación de alguno de tus vehículos. Te avisaremos
              por email.
            </p>
          </div>


          <button
            type="button"
            onClick={() =>
              setBlockedSheetOpen(
                false,
              )
            }
            className="wayco-btn wayco-btn-primary"
          >
            Entendido
          </button>
        </div>
      </BottomSheet>


      {/* ===================================================
       * PAYMENT ALIAS
       * ================================================= */}

      <BottomSheet
        open={
          paymentAliasSheetOpen
        }
        onClose={() =>
          setPaymentAliasSheetOpen(
            false,
          )
        }
        title="Necesitás cargar tu alias"
      >
        <div className="space-y-4">
          <div
            className="flex items-start gap-2.5 rounded-[12px] p-3.5"
            style={{
              background:
                "#FEF9C3",

              border:
                "1px solid #FDE68A",
            }}
          >
            <AlertCircle
              className="mt-0.5 size-4 shrink-0"
              style={{
                color:
                  "#92400E",
              }}
            />

            <p
              className="text-[13px] leading-[1.5]"
              style={{
                color:
                  "#92400E",
              }}
            >
              Antes de publicar un viaje tenés que configurar
              un CBU o alias para poder recibir las transferencias
              de los pasajeros.
            </p>
          </div>


          <button
  type="button"
  onClick={() => {
    setPaymentAliasSheetOpen(
      false,
    );

    setAddPaymentAliasSheetOpen(
      true,
    );
  }}
  className="wayco-btn wayco-btn-primary"
>
  Cargar CBU / Alias
</button>


          <button
            type="button"
            onClick={() =>
              setPaymentAliasSheetOpen(
                false,
              )
            }
            className="wayco-btn wayco-btn-secondary"
          >
            Volver
          </button>
        </div>
            </BottomSheet>


      {/* ===================================================
       * ADD PAYMENT ALIAS
       * ================================================= */}

      <PaymentAliasSheet
        open={
          addPaymentAliasSheetOpen
        }
        onClose={() =>
          setAddPaymentAliasSheetOpen(
            false,
          )
        }
      />
    </div>
  );
}


/* =========================================================
 * VEHICLE NAME
 * ======================================================= */

function formatVehicleName(
  vehicle:
    MyVehicle,
): string {
  return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
}


/* =========================================================
 * UNAVAILABLE VEHICLE
 * ======================================================= */

function getUnavailableVehicleMessage(
  vehicle:
    MyVehicle,
): string {
  if (
    vehicle.validationState ===
    "rechazado"
  ) {
    return "Este vehículo fue rechazado y no puede utilizarse para publicar.";
  }


  if (
    vehicle.validationState ===
    "dado_de_baja"
  ) {
    return "Este vehículo fue dado de baja y no puede utilizarse para publicar.";
  }


  return "Este vehículo todavía está pendiente de aprobación.";
}


/* =========================================================
 * TIMES
 * ======================================================= */

function generateTimes():
  string[] {
  const times:
    string[] = [];


  for (
    let hour = 5;
    hour < 24;
    hour += 1
  ) {
    for (
      let minute = 0;
      minute < 60;
      minute += 15
    ) {
      times.push(
        `${String(
          hour,
        ).padStart(
          2,
          "0",
        )}:${String(
          minute,
        ).padStart(
          2,
          "0",
        )}`,
      );
    }
  }


  return times;
}


/* =========================================================
 * STEPPER
 * ======================================================= */

function Stepper({
  button,
  onClick,
  disabled,
}: {
  button:
    "+" |
    "-";

  onClick:
    () => void;

  disabled?:
    boolean;
}) {
  const Icon =
    button ===
    "+"
      ? Plus
      : Minus;


  return (
    <button
      type="button"
      onClick={
        onClick
      }
      disabled={
        disabled
      }
      className="inline-flex size-9 items-center justify-center rounded-full border bg-white disabled:opacity-40"
      style={{
        borderColor:
          "#E2E0D8",
      }}
      aria-label={
        button ===
        "+"
          ? "Sumar"
          : "Restar"
      }
    >
      <Icon className="size-4" />
    </button>
  );
}


/* =========================================================
 * FIELD
 * ======================================================= */

function Field({
  label,
  children,
}: {
  label:
    string;

  children:
    ReactNode;
}) {
  return (
    <label className="block">
      <span className="wayco-input-label">
        {label}
      </span>

      <div className="mt-1">
        {children}
      </div>
    </label>
  );
}


/* =========================================================
 * ROW
 * ======================================================= */

function Row({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#6B6A66]">
        {label}
      </span>

      <span className="text-right font-medium text-[#111110]">
        {value}
      </span>
    </div>
  );
}