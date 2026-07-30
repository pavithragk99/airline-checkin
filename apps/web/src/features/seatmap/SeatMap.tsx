/**
 * SeatMap.tsx
 *
 * Fetches an aircraft's seat layout and pricing, then renders it inside
 * a fuselage-shaped container: a rounded nose at the top, a real aisle
 * gap splitting each row into two seat groups (A-B-C | D-E-F), and wing
 * markers next to the exit row — so it reads as an actual plane, not a
 * generic grid.
 */

import { useEffect, useState } from "react";
import { strapiClient } from "../../api/strapiClient";
import { useBooking } from "../../context/BookingContext";
import { isExitRowEligible, getSeatPrice } from "../../lib/eligibility";
import { Seat } from "./Seat";
import { SeatLegend } from "./SeatLegend";
import styles from "./SeatMap.module.css";
import { StatusMessage } from "../../components/StatusMessage";

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

interface SeatTierData {
  name: string;
  price: number;
  minAge: number | null;
  eliteFree: boolean;
}

interface AircraftTypeData {
  name: string;
  rows: number;
  seatMap: RowData[];
  tiers: SeatTierData[];
}

interface SeatMapProps {
  aircraftTypeId: string;
  onSeatConfirmed: () => void;
}

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
      .then((data) => setAircraft(data as AircraftTypeData))
      .catch((err) => console.error("Failed to load aircraft type:", err))
      .finally(() => setLoading(false));
  }, [aircraftTypeId]);

  if (loading)
    return <StatusMessage variant="loading">Loading seat map...</StatusMessage>;
  if (!aircraft)
    return (
      <StatusMessage variant="error">
        Could not load seat map. Please try again.
      </StatusMessage>
    );

  const tiersByKey: Record<string, SeatTierData> = {};
  for (const tier of aircraft.tiers) {
    const key = TIER_NAME_TO_KEY[tier.name];
    if (key) tiersByKey[key] = tier;
  }

  const passengerAge = state.passenger?.age ?? 0;
  const isElite = state.passenger?.isElite ?? false;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headingBlock}>
        <span className={styles.eyebrow}>Seat Map</span>
        <h2 className={styles.heading}>{aircraft.name} — Select Your Seat</h2>
      </div>
      <SeatLegend />

      {/* The fuselage: nose cap, rows, tail cap */}
      <div className={styles.fuselage}>
        <div className={styles.nose} aria-hidden="true">
          <span className={styles.noseLabel}>COCKPIT</span>
        </div>

        {aircraft.seatMap.map((row) => {
          // Split each row's 6 seats into left group (A,B,C) and right
          // group (D,E,F) so we can render a real gap between them —
          // that gap is the aisle.
          const leftSeats = row.seats.slice(0, 3);
          const rightSeats = row.seats.slice(3, 6);
          const isExitRow = row.seats.some((s) => s.exitRow);

          return (
            <div key={row.rowNumber} className={styles.rowWrapper}>
              {/* Wing markers only appear next to the exit row, since
                  that's structurally where the wings actually are */}
              {isExitRow && (
                <div className={styles.wingLeft} aria-hidden="true" />
              )}

              <span className={styles.rowNumber}>{row.rowNumber}</span>

              <div className={styles.seatGroup}>
                {leftSeats.map((seat) => {
                  const tier = tiersByKey[seat.tier];
                  if (!tier) return null;
                  return renderSeat(seat, row.rowNumber, tier);
                })}
              </div>

              <div className={styles.aisle} aria-hidden="true" />

              <div className={styles.seatGroup}>
                {rightSeats.map((seat) => {
                  const tier = tiersByKey[seat.tier];
                  if (!tier) return null;
                  return renderSeat(seat, row.rowNumber, tier);
                })}
              </div>

              {isExitRow && (
                <div className={styles.wingRight} aria-hidden="true" />
              )}
            </div>
          );
        })}

        <div className={styles.tail} aria-hidden="true" />
      </div>

      <button
        className={styles.confirmButton}
        disabled={!state.selectedSeat}
        onClick={onSeatConfirmed}
      >
        Confirm Seat {state.selectedSeat ? `(${state.selectedSeat})` : ""}
      </button>
    </div>
  );

  // Small helper kept inside the component so it can close over
  // passengerAge/isElite/state/dispatch without needing to pass them all
  // through as extra parameters
  function renderSeat(seat: SeatData, rowNumber: number, tier: SeatTierData) {
    const price = getSeatPrice(tier, isElite);
    const seatId = `${rowNumber}${seat.letter}`;
    const eligible = seat.exitRow
      ? isExitRowEligible(passengerAge, tier)
      : true;

    return (
      <Seat
        key={seatId}
        letter={seat.letter}
        rowNumber={rowNumber}
        tier={seat.tier}
        price={price}
        isSelected={state.selectedSeat === seatId}
        isDisabled={!eligible}
        onSelect={() => dispatch({ type: "SELECT_SEAT", seat: seatId })}
      />
    );
  }
}
