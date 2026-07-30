/**
 * CheckinPage.tsx
 *
 * Page-level wrapper for the check-in flow. Fetches which flight the
 * passenger is checking into, then renders CheckinFlow. On completion,
 * navigates to seat selection for that same flight.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { strapiClient } from "../api/strapiClient";
import { useBooking } from "../context/BookingContext";
import { CheckinFlow } from "../features/checkin/CheckinFlow";
import { StatusMessage } from "../components/StatusMessage";

// Shape of a Flight entry as returned from Strapi, just the fields this page needs
interface FlightData {
  documentId: string;
  destination: string;
  aircraftType: {
    documentId: string;
  };
}

export function CheckinPage() {
  const navigate = useNavigate();
  const { dispatch } = useBooking();
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(true);

  // For now, hardcode which flight this demo checks into. In a real app this
  // would come from a booking lookup (confirmation code, etc.) — out of scope here.
  const DEMO_FLIGHT_ID = import.meta.env.VITE_DEMO_FLIGHT_ID;

  useEffect(() => {
    strapiClient
      .getFlight(DEMO_FLIGHT_ID)
      .then((data) => setFlight(data as FlightData))
      .catch((err) => console.error("Failed to load flight:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <StatusMessage variant="loading">Loading flight...</StatusMessage>;
  if (!flight)
    return (
      <StatusMessage variant="error">
        Could not load flight. Please try again.
      </StatusMessage>
    );

  // Destination country is a simplification — we're using the city/airport
  // string as a stand-in since Flight doesn't have a separate country field
  const destinationCountry = flight.destination.includes("Montreal")
    ? "Canada"
    : "Brazil";

  return (
    <CheckinFlow
      destinationCountry={destinationCountry}
      onCheckinComplete={() => {
        // Save which flight and aircraft we're proceeding with, so the seat
        // selection page knows what to fetch next
        dispatch({ type: "SET_FLIGHT", flightId: flight.documentId });
        navigate(`/seat-selection/${flight.aircraftType.documentId}`);
      }}
    />
  );
}
