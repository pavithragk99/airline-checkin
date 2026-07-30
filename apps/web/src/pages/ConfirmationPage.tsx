/**
 * ConfirmationPage.tsx
 *
 * Final screen after a seat is confirmed. Styled as the "stamped" ticket —
 * the boarding pass's last stage, with a confirmation seal.
 */

import { useBooking } from "../context/BookingContext";
import { TicketCard } from "../components/TicketCard";
import styles from "./ConfirmationPage.module.css";

export function ConfirmationPage() {
  const { state } = useBooking();

  return (
    <TicketCard eyebrow="Confirmed" title="You're All Set">
      <div className={styles.seal}>✓</div>
      <p className={styles.seatLine}>
        Seat <span className={styles.seatValue}>{state.selectedSeat}</span>
      </p>
      <p className={styles.message}>Have a great flight.</p>
    </TicketCard>
  );
}
