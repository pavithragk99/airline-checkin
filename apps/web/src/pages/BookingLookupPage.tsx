/**
 * BookingLookupPage.tsx
 *
 * Acts as the check-in system's "login" — passenger proves ownership of
 * a booking with reference + last name, same pattern real airlines use
 * (no separate account/password needed). On success, populates
 * BookingContext and moves into the check-in flow.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { strapiClient } from "../api/strapiClient";
import { useBooking } from "../context/BookingContext";
import { TicketCard } from "../components/TicketCard";
import { StatusMessage } from "../components/StatusMessage";
import styles from "./BookingLookupPage.module.css";

// Shape of a Booking entry as returned from Strapi, just what this page needs
interface BookingData {
  documentId: string;
  passengerName: string;
  passengerAge: number;
  isElite: boolean;
  bookedFareClass: "Economy" | "Premium";
  flight: {
    documentId: string;
  };
}

export function BookingLookupPage() {
  const navigate = useNavigate();
  const { dispatch } = useBooking();
  const [reference, setReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const results = (await strapiClient.getBookingByReference(
        reference.trim(),
        lastName.trim(),
      )) as BookingData[];

      if (results.length === 0) {
        setError(
          "We couldn't find a booking with that reference and last name. Please check and try again.",
        );
        setSubmitting(false);
        return;
      }

      const booking = results[0];

      dispatch({
        type: "SET_BOOKING",
        passenger: {
          name: booking.passengerName,
          age: booking.passengerAge,
          isElite: booking.isElite,
        },
        flightId: booking.flight.documentId,
        bookedFareClass: booking.bookedFareClass,
      });

      navigate("/checkin");
    } catch (err) {
      console.error("Booking lookup failed:", err);
      setError(
        "Something went wrong looking up your booking. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <TicketCard eyebrow="Online Check-In" title="Find Your Booking">
      <form onSubmit={handleSubmit} noValidate>
        <label className={styles.field} htmlFor="reference">
          Booking Reference
          <input
            id="reference"
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            required
            autoComplete="off"
            className={styles.input}
          />
        </label>

        <label className={styles.field} htmlFor="lastName">
          Last Name
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
            className={styles.input}
          />
        </label>

        {/* aria-live announces the error to screen readers as soon as it
            appears, without needing focus to move there */}
        {error && (
          <div role="alert" aria-live="assertive">
            <StatusMessage variant="error">{error}</StatusMessage>
          </div>
        )}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Searching..." : "Find My Booking"}
        </button>
      </form>
    </TicketCard>
  );
}
