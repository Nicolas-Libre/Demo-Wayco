export const DEFAULT_FUEL_PRICE_PER_LITER =
  1458;

export const DEFAULT_WEAR_COST_PER_KM =
  17.5;

export function getEstimatedTrafficFactor(
  date: string,
  departureTime: string,
): number {
  const normalizedTime =
    departureTime.length === 5
      ? `${departureTime}:00`
      : departureTime;

  const departure = new Date(
    `${date}T${normalizedTime}`,
  );

  if (
    Number.isNaN(
      departure.getTime(),
    )
  ) {
    return 1;
  }

  const dayOfWeek =
    departure.getDay();

  const hour =
    departure.getHours();

  const isWeekend =
    dayOfWeek === 0 ||
    dayOfWeek === 6;

  if (isWeekend) {
    return 0.95;
  }

  const isPeakHour =
    (
      hour >= 7 &&
      hour <= 9
    ) ||
    (
      hour >= 17 &&
      hour <= 20
    );

  return isPeakHour
    ? 1.3
    : 1;
}