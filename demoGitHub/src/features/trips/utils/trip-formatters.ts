export function getDriverInitial(
  driverName: string,
  customInitial?: string,
): string {
  return (
    customInitial ??
    driverName.trim().charAt(0) ??
    "?"
  ).toUpperCase();
}

export function formatTripPrice(price: number): string {
  return price.toLocaleString("es-AR");
}

export function formatAvailableSeats(
  availableSeats: number,
): string {
  const plural = availableSeats !== 1;

  return `${availableSeats} asiento${plural ? "s" : ""} libre${plural ? "s" : ""}`;
}
