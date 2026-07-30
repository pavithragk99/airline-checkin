/**
 * ProgressIndicator.tsx
 *
 * Shows which check-in step the passenger is on. Styled as a row of
 * amber "gate light" segments, echoing the ticket card's runway-light
 * accent color.
 */

import styles from "./ProgressIndicator.module.css";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={
              step <= currentStep ? styles.segmentFilled : styles.segment
            }
            aria-hidden="true"
          />
        ))}
      </div>
      <span className={styles.label}>
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
