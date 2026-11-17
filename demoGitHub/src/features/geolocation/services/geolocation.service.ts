import type { GeoCoords } from "../types/geolocation.types";

declare global {
  interface Window {
    __waycoGeo?: GeoCoords | null;
  }
}

const DEFAULT_POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
};

const TRACKING_POSITION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 20_000,
  maximumAge: 15_000,
};

export function isGeolocationAvailable(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "geolocation" in navigator
  );
}

export function setWaycoGeo(
  coords: GeoCoords | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.__waycoGeo = coords;
}

export function getWaycoGeo(): GeoCoords | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.__waycoGeo ?? null;
}

export function requestCurrentPosition(
  onSuccess: (coords: GeoCoords) => void,
  onError?: (error: GeolocationPositionError) => void,
  options: PositionOptions = DEFAULT_POSITION_OPTIONS,
): void {
  if (!isGeolocationAvailable()) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const coords = mapPositionToCoords(position);

      setWaycoGeo(coords);
      onSuccess(coords);
    },
    onError,
    options,
  );
}

export function startPositionTracking(
  onPosition?: (coords: GeoCoords) => void,
  onError?: (error: GeolocationPositionError) => void,
): number | null {
  if (!isGeolocationAvailable()) {
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const coords = mapPositionToCoords(position);

      setWaycoGeo(coords);
      onPosition?.(coords);
    },
    onError,
    TRACKING_POSITION_OPTIONS,
  );
}

export function stopPositionTracking(
  watchId: number | null,
): void {
  if (
    watchId === null ||
    !isGeolocationAvailable()
  ) {
    return;
  }

  navigator.geolocation.clearWatch(watchId);
}

function mapPositionToCoords(
  position: GeolocationPosition,
): GeoCoords {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
    capturedAt: Date.now(),
  };
}
