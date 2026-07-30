/**
 * strapiClient.ts
 * Handles all API calls to Strapi. Components should use this instead of
 * calling fetch() directly.
 */

// URL of the Strapi server, set in .env
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

if (!STRAPI_URL) {
  // Stop early with a clear error instead of failing later in a confusing way
  throw new Error("VITE_STRAPI_URL is not defined. Check your .env file.");
}

// Custom error so we can tell apart "server returned an error" vs "request failed completely"
export class StrapiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "StrapiError";
    this.status = status;
  }
}

// Strapi wraps responses like { data: ..., meta: ... }
interface StrapiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

// Makes a GET request to Strapi and returns just the data (unwraps the response)
async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${STRAPI_URL}/api${endpoint}`);

  if (!response.ok) {
    // Something went wrong on the server side (404, 500, etc.)
    throw new StrapiError(
      `Strapi request failed: ${response.statusText}`,
      response.status,
    );
  }

  const json: StrapiResponse<T> = await response.json();
  return json.data;
}

// All the API calls this app needs, grouped in one place
export const strapiClient = {
  // populate=tiers also fetches the linked seat tiers, not just their IDs
  getAircraftTypes: () => request<unknown[]>("/aircraft-types?populate=tiers"),

  getAircraftType: (id: string) =>
    request<unknown>(`/aircraft-types/${id}?populate=tiers`),

  // sort=order:asc keeps steps in the right order for the check-in flow
  getCheckinSteps: () => request<unknown[]>("/checkin-steps?sort=order:asc"),

  getFlights: () => request<unknown[]>("/flights?populate=aircraftType"),

  getFlight: (id: string) =>
    request<unknown>(`/flights/${id}?populate=aircraftType`),

  // Looks up a booking by reference + last name (case-insensitive on last name,
  // exact match on reference). Returns the first match or undefined if none.
  getBookingByReference: (reference: string, lastName: string) =>
    request<unknown[]>(
      `/bookings?filters[bookingReference][$eq]=${encodeURIComponent(
        reference,
      )}&filters[lastName][$eqi]=${encodeURIComponent(lastName)}&populate=flight`,
    ),
};
