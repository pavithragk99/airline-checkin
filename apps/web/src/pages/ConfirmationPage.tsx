/**
 * ConfirmationPage.tsx
 *
 * Shown after a seat is confirmed. Reads the final booking state from
 * context to show a summary.
 */

import { useBooking } from "../context/BookingContext";

export function ConfirmationPage() {
  const { state } = useBooking();

  return (
    <div
      style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}
    >
      <h2>You're All Set!</h2>
      <p>Seat {state.selectedSeat} is confirmed.</p>
      <p>Have a great flight.</p>
    </div>
  );
}
