/**
 * CheckinPage.tsx
 *
 * Page-level wrapper for the check-in flow. The flight comes from
 * BookingContext (set during booking lookup), not a hardcoded id.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { strapiClient } from "../api/strapiClient";
import { useBooking } from "../context/BookingContext";
import { CheckinFlow } from "../features/checkin/CheckinFlow";
import { StatusMessage } from "../components/StatusMessage";

interface FlightData {
  documentId: string;
  destination: string;
  aircraftType: {
    documentId: string;
  };
}

export function CheckinPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useBooking();
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state.selectedFlightId) return;

    strapiClient
      .getFlight(state.selectedFlightId)
      .then((data) => setFlight(data as FlightData))
      .catch((err) => console.error("Failed to load flight:", err))
      .finally(() => setLoading(false));
  }, [state.selectedFlightId]);

  if (loading)
    return <StatusMessage variant="loading">Loading flight...</StatusMessage>;
  if (!flight)
    return (
      <StatusMessage variant="error">
        Could not load flight. Please try again.
      </StatusMessage>
    );

  const destinationCountry = flight.destination.includes("Montreal")
    ? "Canada"
    : "Brazil";

  return (
    <CheckinFlow
      destinationCountry={destinationCountry}
      onCheckinComplete={() => {
        dispatch({ type: "SET_FLIGHT", flightId: flight.documentId });
        navigate(`/seat-selection/${flight.aircraftType.documentId}`);
      }}
    />
  );
}
