/**
 * SeatMap.tsx
 *
 * Fetches an aircraft type's seat layout and pricing tiers from Strapi,
 * then renders the full interactive grid. Uses eligibility.ts to figure out
 * which seats the current passenger can actually select, and what they'd
 * pay for each one.
 */

import { useEffect, useState } from "react";
import { strapiClient } from "../../api/strapiClient";
import { useBooking } from "../../context/BookingContext";
import { isExitRowEligible, getSeatPrice } from "../../lib/eligibility";
import { Seat } from "./Seat";
import { SeatLegend } from "./SeatLegend";

// Shape of a single seat within the seatMap JSON stored in Strapi
interface SeatData {
  letter: string;
  type: "window" | "middle" | "aisle";
  tier: "economy" | "exitRow" | "premium";
  exitRow: boolean;
}

interface RowData {
  rowNumber: number;
  seats: SeatData[];
}

// Shape of a SeatTier entry as returned from Strapi
interface SeatTierData {
  name: string;
  price: number;
  minAge: number | null;
  eliteFree: boolean;
}

// Shape of an AircraftType entry, with its tiers populated
interface AircraftTypeData {
  name: string;
  rows: number;
  seatMap: RowData[];
  tiers: SeatTierData[];
}

interface SeatMapProps {
  aircraftTypeId: string;
  onSeatConfirmed: () => void; // moves the app forward once a seat is picked
}

// Strapi's tier "name" field uses friendly labels ("Economy"), but the
// seatMap JSON uses camelCase keys ("economy", "exitRow", "premium").
// This maps between the two so we can look up the right price for a seat.
const TIER_NAME_TO_KEY: Record<string, string> = {
  Economy: "economy",
  "Exit Row": "exitRow",
  Premium: "premium",
};

export function SeatMap({ aircraftTypeId, onSeatConfirmed }: SeatMapProps) {
  const { state, dispatch } = useBooking();
  const [aircraft, setAircraft] = useState<AircraftTypeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    strapiClient
      .getAircraftType(aircraftTypeId)
      .then((data) => {
        console.log("Raw aircraft data:", data); // TEMP — remove after debugging
        setAircraft(data as AircraftTypeData);
      })
      .catch((err) => console.error("Failed to load aircraft type:", err))
      .finally(() => setLoading(false));
  }, [aircraftTypeId]);

  if (loading) {
    return <p>Loading seat map...</p>;
  }

  if (!aircraft) {
    return <p>Could not load seat map.</p>;
  }

  // Build a lookup so we can find a tier's price/rules by its camelCase key
  // (e.g. "exitRow") rather than searching the tiers array every render
  const tiersByKey: Record<string, SeatTierData> = {};
  for (const tier of aircraft.tiers) {
    const key = TIER_NAME_TO_KEY[tier.name];
    if (key) tiersByKey[key] = tier;
  }

  const passengerAge = state.passenger?.age ?? 0;
  const isElite = state.passenger?.isElite ?? false;

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>{aircraft.name} — Select Your Seat</h2>
      <SeatLegend />

      {aircraft.seatMap.map((row) => (
        <div
          key={row.rowNumber}
          style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}
        >
          <span
            style={{
              width: "1.5rem",
              fontSize: "0.75rem",
              alignSelf: "center",
            }}
          >
            {row.rowNumber}
          </span>
          {row.seats.map((seat) => {
            const tier = tiersByKey[seat.tier];
            // If we can't find pricing data for this tier, treat the seat as
            // unavailable rather than guessing at a price
            if (!tier) return null;

            const price = getSeatPrice(tier, isElite);
            const seatId = `${row.rowNumber}${seat.letter}`;

            // Exit row seats need an age check; other tiers are always eligible
            const eligible = seat.exitRow
              ? isExitRowEligible(passengerAge, tier)
              : true;

            return (
              <Seat
                key={seatId}
                letter={seat.letter}
                rowNumber={row.rowNumber}
                tier={seat.tier}
                price={price}
                isSelected={state.selectedSeat === seatId}
                isDisabled={!eligible}
                onSelect={() => dispatch({ type: "SELECT_SEAT", seat: seatId })}
              />
            );
          })}
        </div>
      ))}

      <button
        disabled={!state.selectedSeat}
        onClick={onSeatConfirmed}
        style={{ marginTop: "1.5rem" }}
      >
        Confirm Seat {state.selectedSeat ? `(${state.selectedSeat})` : ""}
      </button>
    </div>
  );
}
