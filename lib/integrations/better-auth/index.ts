import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";
import { serverUrl } from "@/lib/environment";

export const betterAuthClient = createAuthClient({
  baseURL: serverUrl,
  basePath: "/authentication",
  plugins: [nextCookies()],
});
