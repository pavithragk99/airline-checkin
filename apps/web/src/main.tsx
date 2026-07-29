import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BookingProvider } from "./context/BookingContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* BookingProvider wraps the whole app so check-in and seat selection
        can both read/update shared passenger and booking state */}
    <BookingProvider>
      <App />
    </BookingProvider>
  </StrictMode>,
);
