/**
 * SeatSelectionPage.tsx
 *
 * Page-level wrapper for seat selection. Reads the aircraft type id from
 * the URL (set by CheckinPage's navigate call) and renders SeatMap for it.
 */

import { useParams, useNavigate } from "react-router-dom";
import { SeatMap } from "../features/seatmap/SeatMap";

export function SeatSelectionPage() {
  // aircraftTypeId comes from the route, e.g. /seat-selection/:aircraftTypeId
  const { aircraftTypeId } = useParams<{ aircraftTypeId: string }>();
  const navigate = useNavigate();

  if (!aircraftTypeId) {
    return <p>No aircraft selected.</p>;
  }

  return (
    <SeatMap
      aircraftTypeId={aircraftTypeId}
      onSeatConfirmed={() => navigate("/confirmation")}
    />
  );
}
