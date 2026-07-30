/**
 * BaggageStep.tsx
 *
 * Second check-in step. Asks how many bags the passenger is checking.
 */

import { useState } from "react";
import styles from "./steps.module.css";

interface BaggageStepProps {
  title: string;
  body: string;
  onConfirm: (checkedBags: number) => void;
}

export function BaggageStep({ title, body, onConfirm }: BaggageStepProps) {
  const [checkedBags, setCheckedBags] = useState(0);

  return (
    <div>
      <h2 className={styles.heading}>{title}</h2>
      <p className={styles.body}>{body}</p>
      <label className={styles.inputRow}>
        Bags to check:
        <input
          type="number"
          min={0}
          max={10}
          value={checkedBags}
          onChange={(e) => setCheckedBags(Number(e.target.value))}
          className={styles.numberInput}
        />
      </label>
      <button className={styles.button} onClick={() => onConfirm(checkedBags)}>
        Continue
      </button>
    </div>
  );
}
