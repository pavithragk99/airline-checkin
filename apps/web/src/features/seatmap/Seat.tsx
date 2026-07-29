/**
 * Seat.tsx
 *
 * A single clickable seat. Doesn't know about eligibility rules or pricing
 * itself — just displays whatever state it's given (available, selected,
 * disabled) and reports clicks upward. Keeping it dumb like this makes it
 * easy to test and reuse.
 */

interface SeatProps {
  letter: string;
  rowNumber: number;
  tier: string; // "economy" | "exitRow" | "premium"
  price: number;
  isSelected: boolean;
  isDisabled: boolean; // true if passenger isn't eligible (e.g. too young for exit row)
  onSelect: () => void;
}

// Maps each tier to a background color, just for visual distinction.
// Swapped out for real design tokens in Step 10.
const TIER_COLORS: Record<string, string> = {
  economy: "#e5e7eb",
  exitRow: "#fde68a",
  premium: "#bfdbfe",
};

export function Seat({
  letter,
  rowNumber,
  tier,
  price,
  isSelected,
  isDisabled,
  onSelect,
}: SeatProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isDisabled}
      aria-label={`Seat ${rowNumber}${letter}, ${tier}, $${price}`}
      style={{
        width: "2.5rem",
        height: "3rem", // slightly taller to fit price text
        borderRadius: "4px",
        border: isSelected ? "2px solid #2563eb" : "1px solid #9ca3af",
        backgroundColor: isDisabled
          ? "#f3f4f6"
          : (TIER_COLORS[tier] ?? "#e5e7eb"),
        color: isDisabled ? "#9ca3af" : "#111827",
        cursor: isDisabled ? "not-allowed" : "pointer",
        fontSize: "0.75rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
      }}
    >
      <span>{letter}</span>
      {/* Show price under the letter so passengers can see cost at a glance,
          not just on hover */}
      <span style={{ fontSize: "0.6rem" }}>${price}</span>
    </button>
  );
}
