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

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { BookingLookupPage } from "./pages/BookingLookupPage";
import { CheckinPage } from "./pages/CheckinPage";
import { SeatSelectionPage } from "./pages/SeatSelectionPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lookup" element={<BookingLookupPage />} />
        <Route
          path="/checkin"
          element={
            <ProtectedRoute>
              <CheckinPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seat-selection/:aircraftTypeId"
          element={
            <ProtectedRoute>
              <SeatSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmation"
          element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
