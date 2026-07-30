/**
 * TicketCard.tsx
 *
 * The app's signature visual element — a card styled like a physical
 * boarding pass, with a perforated "tear line" dividing a header stub
 * from the main content. Used to wrap both the check-in flow and seat
 * selection so they feel like one continuous ticket.
 */

import styles from "./TicketCard.module.css";
import type { ReactNode } from "react";

interface TicketCardProps {
  eyebrow: string; // small label above the title, e.g. "BOARDING PASS"
  title: string;
  children: ReactNode;
}

export function TicketCard({ eyebrow, title, children }: TicketCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.stub}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h1 className={styles.title}>{title}</h1>
      </div>
      {/* The perforated tear line — a row of small circles simulating a
          physical ticket perforation */}
      <div className={styles.tearLine} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
