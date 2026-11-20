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

/**
 * Formatea números decimales para mostrarlos
 * en la interfaz de Wayco.
 *
 * - Máximo un decimal.
 * - Separador decimal argentino (coma).
 * - Separador de miles argentino (punto).
 * - Elimina decimales innecesarios.
 * - No modifica la precisión de los cálculos.
 *
 * Ejemplos:
 * 57.34567 -> "57,3"
 * 57.38    -> "57,4"
 * 12       -> "12"
 * 1250.567 -> "1.250,6"
 */
export function formatDecimal(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}