export type TripRouteInfo = {
  distanceKm: number;
  durationMinutes: number;
  tollCost: number;
  description: string;
};

const TRIP_ROUTES:
  Record<string, TripRouteInfo> = {
    "la plata|caba": {
      distanceKm: 60,
      durationMinutes: 65,
      tollCost: 3200,
      description:
        "Autopista Bs. As.–La Plata",
    },

    "la plata|quilmes": {
      distanceKm: 30,
      durationMinutes: 35,
      tollCost: 0,
      description:
        "Camino Centenario",
    },

    "la plata|hudson": {
      distanceKm: 22,
      durationMinutes: 25,
      tollCost: 0,
      description:
        "Autopista Bs. As.–La Plata",
    },

    "hudson|caba": {
      distanceKm: 38,
      durationMinutes: 45,
      tollCost: 3200,
      description:
        "Autopista Bs. As.–La Plata",
    },

    "quilmes|caba": {
      distanceKm: 30,
      durationMinutes: 35,
      tollCost: 3200,
      description:
        "Autopista Bs. As.–La Plata",
    },

    "berazategui|caba": {
      distanceKm: 30,
      durationMinutes: 35,
      tollCost: 3200,
      description:
        "Autopista Bs. As.–La Plata",
    },

    "la plata|berazategui": {
      distanceKm: 25,
      durationMinutes: 30,
      tollCost: 0,
      description:
        "Camino Centenario",
    },
  };

function normalizeLocation(
  value: string,
): string {
  return value
    .trim()
    .toLocaleLowerCase("es-AR");
}

export function getTripRouteInfo(
  origin: string,
  destination: string,
): TripRouteInfo {
  const normalizedOrigin =
    normalizeLocation(origin);

  const normalizedDestination =
    normalizeLocation(destination);

  const directKey =
    `${normalizedOrigin}|${normalizedDestination}`;

  const reverseKey =
    `${normalizedDestination}|${normalizedOrigin}`;

  return (
    TRIP_ROUTES[directKey] ??
    TRIP_ROUTES[reverseKey] ?? {
      distanceKm: 50,
      durationMinutes: 55,
      tollCost: 1600,
      description: "Ruta directa",
    }
  );
}