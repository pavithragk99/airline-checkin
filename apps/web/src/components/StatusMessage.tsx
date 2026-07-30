/**
 * StatusMessage.tsx
 *
 * Shared loading/error message component, so every async state across
 * the app (checkin steps, seat map, flight lookup) looks consistent
 * instead of plain unstyled text.
 */

import styles from "./StatusMessage.module.css";

interface StatusMessageProps {
  variant: "loading" | "error";
  children: React.ReactNode;
}

export function StatusMessage({ variant, children }: StatusMessageProps) {
  return (
    <div className={variant === "loading" ? styles.loading : styles.error}>
      {children}
    </div>
  );
}
