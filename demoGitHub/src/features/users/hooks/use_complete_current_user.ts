import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  complete_current_user,
} from "../api/complete_current_user";


export function use_complete_current_user() {
  const query_client =
    useQueryClient();


  return useMutation({
    mutationFn:
      complete_current_user,

    onSuccess:
      async () => {
        await query_client
          .invalidateQueries({
            queryKey: [
              "users",
              "me",
            ],
          });
      },
  });
}