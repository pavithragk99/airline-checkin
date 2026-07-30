/**
 * DocumentsStep.tsx
 *
 * First check-in step. Shows document/visa requirements for the
 * passenger's destination, pulled from Strapi.
 */

import styles from "./steps.module.css";

interface DocumentsStepProps {
  title: string;
  body: string;
  requiresVisa: boolean;
  onConfirm: () => void;
}

export function DocumentsStep({
  title,
  body,
  requiresVisa,
  onConfirm,
}: DocumentsStepProps) {
  return (
    <div>
      <h2 className={styles.heading}>{title}</h2>
      <p className={styles.body}>{body}</p>
      {requiresVisa && (
        <label className={styles.checkboxRow}>
          <input type="checkbox" required /> I confirm my visa has been approved
        </label>
      )}
      <button className={styles.button} onClick={onConfirm}>
        Continue
      </button>
    </div>
  );
}
