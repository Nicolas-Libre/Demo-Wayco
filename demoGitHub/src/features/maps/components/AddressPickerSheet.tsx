import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Check,
  LoaderCircle,
  MapPin,
  Search,
} from "lucide-react";

import type {
  TripLocationPoint,
} from "@wayco/shared/trips";

import {
  BottomSheet,
} from "@/components/overlays/BottomSheet";

import type {
  WaycoArea,
} from "../config/wayco_areas";

import {
  load_places_library,
} from "../services/google_maps_loader";

import {
  geocode_address_api,
} from "../services/maps_geocoding_api";

import {
  ApiError,
} from "@/lib/api";

interface AddressPickerSheetProps {
  open: boolean;
  type: "origin" | "destination";
  area: WaycoArea | null;
  initialPoint?: TripLocationPoint | null;
  onClose: () => void;
  onConfirm: (point: TripLocationPoint) => void;
}

export function AddressPickerSheet({
  open,
  type,
  area,
  initialPoint = null,
  onClose,
  onConfirm,
}: AddressPickerSheetProps) {
  const autocompleteContainerRef =
    useRef<HTMLDivElement | null>(null);

  const autocompleteRef =
    useRef<google.maps.places.PlaceAutocompleteElement | null>(
      null,
    );

  const requestIdRef =
    useRef(0);

  const resolvedAddressRef =
    useRef(initialPoint?.address ?? "");

  const [loading, setLoading] =
    useState(false);

  const [resolving, setResolving] =
    useState(false);

  const [addressWasEdited, setAddressWasEdited] =
    useState(false);

  const [selectedPoint, setSelectedPoint] =
    useState<TripLocationPoint | null>(
      initialPoint,
    );

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (
      !open ||
      !area ||
      !autocompleteContainerRef.current
    ) {
      return;
    }

    const activeArea = area;

    let cancelled = false;

    let selectListener:
      ((event: Event) => void) | null = null;

    let inputListener:
      ((event: Event) => void) | null = null;

    async function initializeAutocomplete() {
      try {
        setLoading(true);
        setErrorMessage(null);

        const placesLibrary =
          await load_places_library();

        if (
          cancelled ||
          !autocompleteContainerRef.current
        ) {
          return;
        }

        const autocomplete =
          new placesLibrary.PlaceAutocompleteElement();

        autocomplete.placeholder =
          type === "origin"
            ? "Escribí la dirección de origen"
            : "Escribí la dirección de destino";

        autocomplete.requestedLanguage = "es";
        autocomplete.requestedRegion = "ar";
        autocomplete.includedRegionCodes = ["ar"];

        autocomplete.locationBias = {
          center: activeArea.center,
          radius: 15000,
        };

        autocomplete.style.width = "100%";
        autocomplete.style.backgroundColor = "#FFFFFF";
        autocomplete.style.color = "#111110";
        autocomplete.style.border = "1px solid #E5E4DF";
        autocomplete.style.borderRadius = "12px";
        autocomplete.style.colorScheme = "light";

        if (initialPoint) {
          autocomplete.value = initialPoint.address;
          resolvedAddressRef.current =
            initialPoint.address;
        } else {
          resolvedAddressRef.current = "";
        }

        autocompleteContainerRef.current.replaceChildren(
          autocomplete,
        );

        autocompleteRef.current = autocomplete;

        inputListener = () => {
          requestIdRef.current += 1;

          const typedAddress =
            autocomplete.value.trim();

          setAddressWasEdited(
            typedAddress !==
              resolvedAddressRef.current.trim(),
          );

          setResolving(false);
          setErrorMessage(null);
        };

        autocomplete.addEventListener(
          "input",
          inputListener,
        );

        selectListener = (event: Event) => {
          void handlePlaceSelection(
            event,
            activeArea,
          );
        };

        autocomplete.addEventListener(
          "gmp-select",
          selectListener,
        );
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el buscador de direcciones.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initializeAutocomplete();

    return () => {
      cancelled = true;
      requestIdRef.current += 1;

      const autocomplete =
        autocompleteRef.current;

      if (autocomplete && selectListener) {
        autocomplete.removeEventListener(
          "gmp-select",
          selectListener,
        );
      }

      if (autocomplete && inputListener) {
        autocomplete.removeEventListener(
          "input",
          inputListener,
        );
      }

      autocompleteContainerRef.current?.replaceChildren();

      autocompleteRef.current = null;
    };
  }, [
    open,
    area,
    initialPoint,
    type,
  ]);

  useEffect(() => {
    if (!open) {
      requestIdRef.current += 1;
      setSelectedPoint(initialPoint);
      setAddressWasEdited(false);
      setResolving(false);
      setErrorMessage(null);

      resolvedAddressRef.current =
        initialPoint?.address ?? "";
    }
  }, [
    open,
    initialPoint,
  ]);

  function isPointInsideArea(
    point: TripLocationPoint,
    activeArea: WaycoArea,
  ): boolean {
    const earthRadiusKm = 6371.0088;

    const toRadians = (value: number) =>
      (value * Math.PI) / 180;

    const latitudeDifference =
      toRadians(
        point.lat - activeArea.center.lat,
      );

    const longitudeDifference =
      toRadians(
        point.lng - activeArea.center.lng,
      );

    const a =
      Math.sin(latitudeDifference / 2) ** 2 +
      Math.cos(toRadians(activeArea.center.lat)) *
        Math.cos(toRadians(point.lat)) *
        Math.sin(longitudeDifference / 2) ** 2;

    const distance =
      2 *
      earthRadiusKm *
      Math.asin(
        Math.min(1, Math.sqrt(a)),
      );

    return distance <= 20;
  }

  async function handlePlaceSelection(
    event: Event,
    activeArea: WaycoArea,
  ) {
    const selectEvent =
      event as google.maps.places.PlacePredictionSelectEvent;

    const prediction =
      selectEvent.placePrediction;

    if (!prediction) {
      return;
    }

    const requestId =
      ++requestIdRef.current;

    try {
      setResolving(true);
      setErrorMessage(null);

      const place =
        prediction.toPlace();

      await place.fetchFields({
        fields: [
          "formattedAddress",
          "location",
          "addressComponents",
        ],
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      if (!place.location) {
        setErrorMessage(
          "No pudimos encontrar esa dirección.",
        );

        return;
      }

      const point: TripLocationPoint = {
        lat: place.location.lat(),
        lng: place.location.lng(),
        address:
          place.formattedAddress ??
          prediction.text.toString(),
      };

      const localityComponent =
        place.addressComponents?.find(
          (component) =>
            component.types.includes("locality"),
        );

      if (localityComponent?.longText) {
        point.locality =
          localityComponent.longText;
      }

      if (!isPointInsideArea(point, activeArea)) {
        setSelectedPoint(null);

        setErrorMessage(
          `La dirección seleccionada está fuera de la zona de ${activeArea.name}.`,
        );

        return;
      }

      setSelectedPoint(point);
      setAddressWasEdited(false);

      resolvedAddressRef.current =
        point.address;

      const autocomplete =
        autocompleteRef.current;

      if (autocomplete) {
        autocomplete.value =
          point.address;
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setErrorMessage(
          "No pudimos encontrar esa dirección.",
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setResolving(false);
      }
    }
  }

  async function resolveTypedAddress() {
    const autocomplete =
      autocompleteRef.current;

    if (!autocomplete || !area) {
      return;
    }

    const typedAddress =
      autocomplete.value.trim();

    if (!typedAddress) {
      setErrorMessage(
        "Ingresá una dirección.",
      );

      return;
    }

    const requestId =
      ++requestIdRef.current;

    try {
      setResolving(true);
      setErrorMessage(null);

      const result =
        await geocode_address_api(
          `${typedAddress}, ${area.name}, Argentina`,
        );

      if (requestId !== requestIdRef.current) {
        return;
      }

      const point: TripLocationPoint = {
        lat: result.lat,
        lng: result.lng,
        address:
          result.address || typedAddress,
        ...(result.locality
          ? { locality: result.locality }
          : {}),
      };

      if (!isPointInsideArea(point, area)) {
        setSelectedPoint(null);

        setErrorMessage(
          `La dirección ingresada está fuera de la zona de ${area.name}.`,
        );

        return;
      }

      setSelectedPoint(point);
      setAddressWasEdited(false);

      resolvedAddressRef.current =
        point.address;

      autocomplete.value =
        point.address;
    } catch (error) {
      if (requestId === requestIdRef.current) {
        setErrorMessage(
          getGeocodingErrorMessage(error),
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setResolving(false);
      }
    }
  }

  function handleConfirm() {
    if (
      !selectedPoint ||
      addressWasEdited ||
      loading ||
      resolving
    ) {
      return;
    }

    onConfirm(selectedPoint);
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={
        type === "origin"
          ? "Dirección de origen"
          : "Dirección de destino"
      }
    >
      {!area ? (
        <p className="text-[13px] text-[#6B6A66]">
          Primero seleccioná una localidad.
        </p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-[13px] text-[#6B6A66]">
              Escribí la calle y el número de la dirección.
            </p>

            <p className="mt-1 text-[12px] font-semibold text-[#0F6E56]">
              Localidad: {area.name}
            </p>
          </div>

          <div
            ref={autocompleteContainerRef}
            className="min-h-[48px] w-full"
          />

          {loading && (
            <div className="flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin text-[#1D9E75]" />

              <span className="text-[12px] text-[#6B6A66]">
                Cargando direcciones…
              </span>
            </div>
          )}

          {addressWasEdited && !resolving && (
            <button
              type="button"
              onClick={() => {
                void resolveTypedAddress();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#0F6E56] px-4 py-2.5 text-[13px] font-semibold text-[#0F6E56]"
            >
              <Search className="size-4" />
              Buscar dirección
            </button>
          )}

          {resolving && (
            <div className="flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin text-[#1D9E75]" />

              <span className="text-[12px] text-[#6B6A66]">
                Buscando dirección…
              </span>
            </div>
          )}

          {!addressWasEdited &&
            selectedPoint &&
            !resolving && (
              <div className="rounded-[12px] border border-[#9FE1CB] bg-[#E8F5F0] p-3">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#0F6E56]" />

                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-[#0F6E56]">
                      Dirección seleccionada
                    </p>

                    <p className="mt-1 text-[13px] text-[#111110]">
                      {selectedPoint.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {errorMessage && (
            <div className="rounded-[12px] border border-red-200 bg-red-50 p-3">
              <p className="text-[12px] text-red-700">
                {errorMessage}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              !selectedPoint ||
              addressWasEdited ||
              loading ||
              resolving
            }
            className="wayco-btn wayco-btn-primary disabled:opacity-40"
          >
            <MapPin className="mr-2 inline size-4" />
            Confirmar dirección
          </button>

          <button
            type="button"
            onClick={onClose}
            className="wayco-btn wayco-btn-secondary"
          >
            Volver
          </button>
        </div>
      )}
    </BottomSheet>
  );
}

function getGeocodingErrorMessage(
  error: unknown,
): string {
  if (error instanceof ApiError) {
    if (error.status_code === 429) {
      return "Se alcanzó el límite mensual de consultas de Google Maps.";
    }

    if (error.status_code === 503) {
      return "La búsqueda de direcciones no está disponible temporalmente.";
    }
  }

  return "La dirección ingresada no existe o no pudo ser encontrada.";
}