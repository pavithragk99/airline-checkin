/**
 * SeatLegend.tsx
 *
 * Explains what each seat color means. Static — doesn't need any props
 * since the tier colors are fixed.
 */

const LEGEND_ITEMS = [
  { label: "Economy", color: "#e5e7eb" },
  { label: "Exit Row", color: "#fde68a" },
  { label: "Premium", color: "#bfdbfe" },
];

export function SeatLegend() {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1rem",
        fontSize: "0.85rem",
      }}
    >
      {LEGEND_ITEMS.map((item) => (
        <div
          key={item.label}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <span
            style={{
              display: "inline-block",
              width: "1rem",
              height: "1rem",
              borderRadius: "3px",
              backgroundColor: item.color,
              border: "1px solid #9ca3af",
            }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
}
