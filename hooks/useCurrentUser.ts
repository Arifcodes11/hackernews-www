// hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { serverUrl } from "@/lib/environment";
import {  userSchema } from "@/lib/extras/schemas/user";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await fetch(`${serverUrl}/users/me`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const json = await response.json();
      const result = userSchema.parse(json);
      return result;
    },  });
};
