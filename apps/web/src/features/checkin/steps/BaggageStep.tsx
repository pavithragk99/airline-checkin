/**
 * BaggageStep.tsx
 *
 * Second check-in step. Asks how many bags the passenger is checking.
 * Keeps its own local input state, then hands the final number up via
 * onConfirm when the passenger continues.
 */

import { useState } from "react";

interface BaggageStepProps {
  title: string;
  body: string;
  onConfirm: (checkedBags: number) => void;
}

export function BaggageStep({ title, body, onConfirm }: BaggageStepProps) {
  // Local state for the input — only reported up to the parent on confirm,
  // not on every keystroke, since nothing else needs it until then
  const [checkedBags, setCheckedBags] = useState(0);

  return (
    <div>
      <h2>{title}</h2>
      <p>{body}</p>
      <label style={{ display: "block", margin: "1rem 0" }}>
        Bags to check:
        <input
          type="number"
          min={0}
          max={10}
          value={checkedBags}
          onChange={(e) => setCheckedBags(Number(e.target.value))}
          style={{ marginLeft: "0.5rem", width: "4rem" }}
        />
      </label>
      <button onClick={() => onConfirm(checkedBags)}>Continue</button>
    </div>
  );
}
