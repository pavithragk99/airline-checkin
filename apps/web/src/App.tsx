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
 * Root component. Full routing gets added later — for now, just renders
 * the check-in flow directly so we can see and test it.
 */

import { CheckinFlow } from "./features/checkin/CheckinFlow";

function App() {
  return (
    <CheckinFlow
      destinationCountry="Canada"
      onCheckinComplete={() =>
        alert("Check-in complete! Seat selection comes next.")
      }
    />
  );
}

export default App;
