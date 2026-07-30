/**
 * ProtectedRoute.tsx
 *
 * Guards routes that require an active booking in context (check-in,
 * seat selection, confirmation). If someone lands on one of these URLs
 * directly — bookmarked, typed manually, or refreshed after context was
 * cleared — they get redirected back to the landing page instead of
 * seeing a broken/empty screen.
 */

import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { state } = useBooking();

  // No passenger/flight in context means no valid booking has been
  // looked up yet this session — bounce back to the landing page
  if (!state.passenger || !state.selectedFlightId) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
