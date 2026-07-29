/**
 * eligibility.ts
 * Core business rules for check-in and seat selection. Kept separate from
 * any UI component so both the check-in flow and seat map can use the same
 * rules without duplicating logic, and so the rules can be unit tested on
 * their own.
 */

// Shape of a flight, just the fields these functions actually need
interface Flight {
  departureTime: string; // ISO date string
  checkinOpensHoursBefore: number;
}

// Shape of a seat tier, just the fields these functions actually need
interface SeatTier {
  price: number;
  minAge: number | null;
  eliteFree: boolean;
}

/**
 * Checks whether check-in is currently open for a flight.
 * Check-in opens `checkinOpensHoursBefore` hours before departure,
 * and stays open until departure.
 */
export function isCheckinOpen(flight: Flight, now: Date = new Date()): boolean {
  const departure = new Date(flight.departureTime);
  const checkinOpensAt = new Date(
    departure.getTime() - flight.checkinOpensHoursBefore * 60 * 60 * 1000,
  );

  // Open if we're at or after the opening time, and before departure
  return now >= checkinOpensAt && now < departure;
}

/**
 * Checks whether a passenger is old enough to sit in an exit row seat.
 * If the tier has no minAge (e.g. economy, premium), everyone is eligible.
 */
export function isExitRowEligible(
  passengerAge: number,
  tier: SeatTier,
): boolean {
  if (tier.minAge === null) {
    // No age restriction on this tier
    return true;
  }
  return passengerAge >= tier.minAge;
}

/**
 * Calculates what a passenger actually pays for a given seat tier.
 * Elite passengers get eligible tiers for free; everyone else pays list price.
 */
export function getSeatPrice(
  tier: SeatTier,
  isElitePassenger: boolean,
): number {
  if (isElitePassenger && tier.eliteFree) {
    return 0;
  }
  return tier.price;
}
