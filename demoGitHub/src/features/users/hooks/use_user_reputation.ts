import { useQuery } from "@tanstack/react-query";

import {
  get_user_reputation,
} from "../api/users_reputation_api";

export function use_user_reputation() {
  return useQuery({
    queryKey: ["users", "me", "reputation"],
    queryFn: get_user_reputation,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}