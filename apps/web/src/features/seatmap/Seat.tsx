/**
 * Seat.tsx
 *
 * A single clickable seat, styled like a seat-back viewed from above —
 * rounded top corners only, so a row of these actually reads as seats
 * rather than generic buttons.
 */

import styles from "./Seat.module.css";

interface SeatProps {
  letter: string;
  rowNumber: number;
  tier: string;
  price: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export function Seat({
  letter,
  rowNumber,
  tier,
  price,
  isSelected,
  isDisabled,
  onSelect,
}: SeatProps) {
  // Tier maps to a CSS class rather than an inline color, so all the
  // color logic lives in the stylesheet, not scattered in JS
  const tierClass = styles[tier] ?? styles.economy;

  return (
    <button
      onClick={onSelect}
      disabled={isDisabled}
      aria-label={`Seat ${rowNumber}${letter}, ${tier}, $${price}`}
      className={[
        styles.seat,
        tierClass,
        isSelected ? styles.selected : "",
        isDisabled ? styles.disabled : "",
      ].join(" ")}
    >
      <span className={styles.letter}>{letter}</span>
      <span className={styles.price}>${price}</span>
    </button>
  );
}
