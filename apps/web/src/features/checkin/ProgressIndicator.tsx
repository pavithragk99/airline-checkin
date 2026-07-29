/**
 * ProgressIndicator.tsx
 *
 * Shows the passenger which check-in step they're on, out of how many.
 * Doesn't know anything about what the steps actually are — just takes
 * numbers, so it can be reused anywhere a step count is needed.
 */

interface ProgressIndicatorProps {
  currentStep: number; // 1-indexed, e.g. step 2 of 4
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
      {/* Build one dot/bar per step, filled in if it's at or before the current step */}
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          style={{
            flex: 1,
            height: "6px",
            borderRadius: "3px",
            backgroundColor: step <= currentStep ? "#2563eb" : "#e5e7eb",
          }}
          aria-hidden="true"
        />
      ))}
      <span
        style={{
          fontSize: "0.85rem",
          marginLeft: "0.5rem",
          whiteSpace: "nowrap",
        }}
      >
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
