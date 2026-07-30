/**
 * LandingPage.tsx
 *
 * Public entry point. No booking data needed here — just a simple
 * marketing-style hero with a call to action into booking lookup.
 */

import { useNavigate } from "react-router-dom";
import { TicketCard } from "../components/TicketCard";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <TicketCard eyebrow="Pearson Airlines" title="Ready for Takeoff">
      <p className={styles.subtitle}>
        Check in online, choose your seat, and get your boarding pass in
        minutes.
      </p>
      <button className={styles.cta} onClick={() => navigate("/lookup")}>
        Check In Now
      </button>
    </TicketCard>
  );
}
