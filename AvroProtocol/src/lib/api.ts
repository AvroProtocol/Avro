/**
 * Canonical Avro API origin for the public web application.
 *
 * Production can override this with VITE_BACKEND_URL (preferred) or VITE_API_URL.
 * Keeping the fallback on the Avro hostname means no client ships a legacy brand
 * or infrastructure hostname, while local/preview deployments can still point at
 * any compatible co-signer backend without source changes.
 */
export const AVRO_API_URL = (
  (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim() ||
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
  "https://api.avroprotocol.com"
).replace(/\/+$/, "");

export function avroApiUrl(path = ""): string {
  if (!path) return AVRO_API_URL;
  return `${AVRO_API_URL}/${path.replace(/^\/+/, "")}`;
}
