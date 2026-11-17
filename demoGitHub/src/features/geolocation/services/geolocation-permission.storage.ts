import type {
  GeoPermissionDecision,
  GeoPermissionScope,
} from "../types/geolocation.types";

const STORAGE_KEY = "wayco:geo-permission";

function createStorageKey(
  scope: GeoPermissionScope,
): string {
  return `${STORAGE_KEY}:${scope}`;
}

export function readGeoPermissionDecision(
  scope: GeoPermissionScope,
): GeoPermissionDecision | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = localStorage.getItem(
      createStorageKey(scope),
    );

    if (value === "granted" || value === "denied") {
      return value;
    }

    return null;
  } catch {
    return null;
  }
}

export function writeGeoPermissionDecision(
  scope: GeoPermissionScope,
  decision: GeoPermissionDecision,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      createStorageKey(scope),
      decision,
    );
  } catch {
    // El flujo puede continuar aunque localStorage falle.
  }
}
