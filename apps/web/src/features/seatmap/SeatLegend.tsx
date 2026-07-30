/**
 * SeatLegend.tsx
 *
 * Explains what each seat color means, using the same tier classes as
 * the actual seats so the legend always matches reality.
 */

import styles from "./SeatLegend.module.css";
import seatStyles from "./Seat.module.css";

const LEGEND_ITEMS = [
  { label: "Economy", className: seatStyles.economy },
  { label: "Exit Row", className: seatStyles.exitRow },
  { label: "Premium", className: seatStyles.premium },
];

export function SeatLegend() {
  return (
    <div className={styles.legend}>
      {LEGEND_ITEMS.map((item) => (
        <div key={item.label} className={styles.item}>
          <span className={`${styles.swatch} ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  );
}
