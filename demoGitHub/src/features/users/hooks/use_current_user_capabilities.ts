import {
  useQuery,
} from "@tanstack/react-query";

import {
  get_current_user_capabilities,
} from "../api/get_current_user_capabilities";


export const CURRENT_USER_CAPABILITIES_QUERY_KEY =
  [
    "users",
    "me",
    "capabilities",
  ] as const;


export function use_current_user_capabilities() {
  return useQuery({
    queryKey:
      CURRENT_USER_CAPABILITIES_QUERY_KEY,

    queryFn:
      get_current_user_capabilities,

    retry:
      false,
  });
}