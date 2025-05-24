import { headers } from "next/headers";

const DEFAULT_ALLOWED_HEADERS = ["authorization", "cookie"];

export const forwardableHeaders = async (): Promise<Headers> => {
  const incomingHeaders = await headers();
  const forwardedHeaders = new Headers();

  for (const key of incomingHeaders.keys()) {
    if (DEFAULT_ALLOWED_HEADERS.includes(key.toLowerCase())) {
      const val = incomingHeaders.get(key);
      if (val) {
        forwardedHeaders.set(key, val);
      }
    }
  }

  return forwardedHeaders;
};
