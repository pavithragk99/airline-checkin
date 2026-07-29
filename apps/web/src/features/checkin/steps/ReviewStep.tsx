/**
 * ReviewStep.tsx
 *
 * Final check-in step. Shows a summary before handing off to seat selection.
 * Doesn't fetch anything itself — just displays whatever booking state is
 * passed in, so it stays simple and easy to test.
 */

interface ReviewStepProps {
  passengerName: string;
  checkedBags: number;
  onComplete: () => void; // moves on to seat selection
}

export function ReviewStep({
  passengerName,
  checkedBags,
  onComplete,
}: ReviewStepProps) {
  return (
    <div>
      <h2>Review & Confirm</h2>
      <p>Passenger: {passengerName}</p>
      <p>Bags checked: {checkedBags}</p>
      <button onClick={onComplete}>Complete Check-In</button>
    </div>
  );
}
