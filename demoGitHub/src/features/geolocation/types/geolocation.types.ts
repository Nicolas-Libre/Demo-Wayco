export type GeoCoords = {
  lat: number;
  lng: number;
  accuracy: number;
  capturedAt: number;
};

export type GeoPermissionDecision =
  | "granted"
  | "denied";

export type GeoPermissionScope =
  | "buscar"
  | "publicar";
