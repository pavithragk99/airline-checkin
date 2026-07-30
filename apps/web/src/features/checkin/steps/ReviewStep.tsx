/**
 * ReviewStep.tsx
 *
 * Final check-in step. Shows a summary before handing off to seat selection.
 */

import styles from "./steps.module.css";

interface ReviewStepProps {
  passengerName: string;
  checkedBags: number;
  onComplete: () => void;
}

export function ReviewStep({
  passengerName,
  checkedBags,
  onComplete,
}: ReviewStepProps) {
  return (
    <div>
      <h2 className={styles.heading}>Review & Confirm</h2>
      <div className={styles.summaryRow}>
        <span>Passenger</span>
        <span className={styles.summaryValue}>{passengerName}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Bags checked</span>
        <span className={styles.summaryValue}>{checkedBags}</span>
      </div>
      <button
        className={styles.button}
        onClick={onComplete}
        style={{ marginTop: "var(--space-md)" }}
      >
        Complete Check-In
      </button>
    </div>
  );
}
