import { api_get } from "@/lib/api/api_client";

export type UserReputation = {
  driverRating: number | null;
  passengerRating: number | null;
  driverTrips: number;
  passengerTrips: number;
};

export function get_user_reputation(): Promise<UserReputation> {
  return api_get<UserReputation>(
    "/api/users/me/reputation",
  );
}