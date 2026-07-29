/**
 * App.tsx
 *
 * Root component. Routing and real page content get added in later steps
 * (check-in flow, seat selection). For now this is just a placeholder so
 * the app renders cleanly.
 */

// function App() {
//   return <div>Airline Check-In — under construction</div>;
// }

// export default App;

/**
 * App.tsx
 *
 * Sets up routing between the check-in flow, seat selection, and the final
 * confirmation screen.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CheckinPage } from "./pages/CheckinPage";
import { SeatSelectionPage } from "./pages/SeatSelectionPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the root path straight into check-in for this demo */}
        <Route path="/" element={<Navigate to="/checkin" replace />} />
        <Route path="/checkin" element={<CheckinPage />} />
        <Route
          path="/seat-selection/:aircraftTypeId"
          element={<SeatSelectionPage />}
        />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
