export type TripPricingInput = {
  passengerCount: number;
  consumptionL100Km: number;

  distanceKm: number;
  durationMinutes: number;
  tollCost: number;

  fuelPricePerLiter: number;
  wearCostPerKm: number;

  /**
   * Factor estimado de tráfico.
   * 1 representa consumo normal.
   */
  trafficFactor?: number;
};

export type TripPricingBreakdown = {
  distanceKm: number;
  durationMinutes: number;

  adjustedConsumptionL100Km: number;

  fuelCost: number;
  tollCost: number;
  totalWearCost: number;
  totalTripCost: number;

  sharedFuelAndTollCost: number;
  passengerWearCost: number;

  suggestedPricePerPassenger: number;
  minimumPricePerPassenger: number;
  maximumPricePerPassenger: number;

  driverSharedCost: number;
};

export class InvalidTripPricingInputError
  extends Error {
  constructor(message: string) {
    super(message);

    this.name =
      "InvalidTripPricingInputError";
  }
}