import {
  MAX_PASSENGER_COUNT,
  MAX_PRICE_VARIATION_PERCENTAGE,
  MAX_TRAFFIC_FACTOR,
  MIN_PASSENGER_COUNT,
  MIN_PRICE_VARIATION_PERCENTAGE,
  MIN_TRAFFIC_FACTOR,
} from "./pricing_constants.js";

import {
  InvalidTripPricingInputError,
  type TripPricingBreakdown,
  type TripPricingInput,
} from "./pricing_types.js";

function assertFinitePositiveNumber(
  value: number,
  fieldName: string,
): void {
  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    throw new InvalidTripPricingInputError(
      `${fieldName} debe ser un número mayor que cero.`,
    );
  }
}

function assertFiniteNonNegativeNumber(
  value: number,
  fieldName: string,
): void {
  if (
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new InvalidTripPricingInputError(
      `${fieldName} debe ser un número mayor o igual que cero.`,
    );
  }
}

function validatePassengerCount(
  passengerCount: number,
): void {
  if (
    !Number.isInteger(passengerCount) ||
    passengerCount < MIN_PASSENGER_COUNT ||
    passengerCount > MAX_PASSENGER_COUNT
  ) {
    throw new InvalidTripPricingInputError(
      `La cantidad de pasajeros debe ser un número entero entre ${MIN_PASSENGER_COUNT} y ${MAX_PASSENGER_COUNT}.`,
    );
  }
}

function validateTrafficFactor(
  trafficFactor: number,
): void {
  if (
    !Number.isFinite(trafficFactor) ||
    trafficFactor < MIN_TRAFFIC_FACTOR ||
    trafficFactor > MAX_TRAFFIC_FACTOR
  ) {
    throw new InvalidTripPricingInputError(
      `El factor de tráfico debe encontrarse entre ${MIN_TRAFFIC_FACTOR} y ${MAX_TRAFFIC_FACTOR}.`,
    );
  }
}

export function calculateTripPrice(
  input: TripPricingInput,
): TripPricingBreakdown {
  validatePassengerCount(
    input.passengerCount,
  );

  assertFinitePositiveNumber(
    input.consumptionL100Km,
    "El consumo",
  );

  assertFinitePositiveNumber(
    input.distanceKm,
    "La distancia",
  );

  assertFinitePositiveNumber(
    input.durationMinutes,
    "La duración",
  );

  assertFiniteNonNegativeNumber(
    input.tollCost,
    "El costo del peaje",
  );

  assertFinitePositiveNumber(
    input.fuelPricePerLiter,
    "El precio por litro de combustible",
  );

  assertFiniteNonNegativeNumber(
    input.wearCostPerKm,
    "El costo de desgaste por kilómetro",
  );

  const trafficFactor =
    input.trafficFactor ?? 1;

  validateTrafficFactor(trafficFactor);

  const adjustedConsumptionL100Km =
    input.consumptionL100Km *
    trafficFactor;

  const fuelCost = Math.round(
    (
      input.distanceKm *
      adjustedConsumptionL100Km /
      100
    ) * input.fuelPricePerLiter,
  );

  const totalWearCost = Math.round(
    input.distanceKm *
      input.wearCostPerKm,
  );

  const tollCost =
    Math.round(input.tollCost);

  const totalTripCost =
    fuelCost +
    tollCost +
    totalWearCost;

  const totalPeople =
    input.passengerCount + 1;

  const sharedFuelAndTollCost =
    Math.round(
      (fuelCost + tollCost) /
        totalPeople,
    );

  const passengerWearCost =
    Math.round(
      totalWearCost /
        input.passengerCount,
    );

  const suggestedPricePerPassenger =
    sharedFuelAndTollCost +
    passengerWearCost;

  const minimumPricePerPassenger =
    Math.round(
      suggestedPricePerPassenger *
        (
          1 -
          MIN_PRICE_VARIATION_PERCENTAGE
        ),
    );

  const maximumPricePerPassenger =
    Math.round(
      suggestedPricePerPassenger *
        (
          1 +
          MAX_PRICE_VARIATION_PERCENTAGE
        ),
    );

  return {
    distanceKm: input.distanceKm,
    durationMinutes:
      input.durationMinutes,

    adjustedConsumptionL100Km,

    fuelCost,
    tollCost,
    totalWearCost,
    totalTripCost,

    sharedFuelAndTollCost,
    passengerWearCost,

    suggestedPricePerPassenger,
    minimumPricePerPassenger,
    maximumPricePerPassenger,

    driverSharedCost:
      sharedFuelAndTollCost,
  };
}