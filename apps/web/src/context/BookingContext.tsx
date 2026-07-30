/**
 * BookingContext.tsx
 *
 * Holds passenger and booking info that both the check-in flow and the seat
 * selection screen need to share — passenger details, which check-in steps
 * are done, and the seat they pick. Using Context + useReducer here instead
 * of prop drilling or a state library, since the app only has two screens
 * that need this shared state.
 */

import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

// Passenger info collected during check-in
interface Passenger {
  name: string;
  age: number;
  isElite: boolean; // elite status affects seat pricing (see eligibility.ts)
}

// Tracks whether each check-in step has been completed, keyed by stepKey
// (e.g. "documents-domestic", "baggage") from Strapi's CheckinStep content type
type CompletedSteps = Record<string, boolean>;

// The full shape of booking state shared across the app
interface BookingState {
  passenger: Passenger | null;
  completedSteps: CompletedSteps;
  selectedFlightId: string | null;
  selectedSeat: string | null;
  bookedFareClass: "Economy" | "Premium" | null; // NEW
  hasPaidUpgrade: boolean; // NEW — set true if passenger accepts the upgrade offer
}

// All the ways booking state can change. Using a discriminated union so
// TypeScript can narrow the action type in the reducer's switch statement.
type BookingAction =
  | { type: "SET_PASSENGER"; passenger: Passenger }
  | { type: "COMPLETE_STEP"; stepKey: string }
  | { type: "SET_FLIGHT"; flightId: string }
  | { type: "SELECT_SEAT"; seat: string }
  | {
      type: "SET_BOOKING";
      passenger: Passenger;
      flightId: string;
      bookedFareClass: "Economy" | "Premium";
    } // NEW
  | { type: "ACCEPT_UPGRADE" } // NEW
  | { type: "RESET" };

const initialState: BookingState = {
  passenger: null,
  completedSteps: {},
  selectedFlightId: null,
  selectedSeat: null,
  bookedFareClass: null,
  hasPaidUpgrade: false,
};

// Pure reducer function — given current state and an action, returns new state.
// Kept outside the component so it's easy to read and (if needed) test on its own.
function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case "SET_PASSENGER":
      return { ...state, passenger: action.passenger };

    case "COMPLETE_STEP":
      return {
        ...state,
        completedSteps: { ...state.completedSteps, [action.stepKey]: true },
      };

    case "SET_FLIGHT":
      return { ...state, selectedFlightId: action.flightId };

    case "SELECT_SEAT":
      return { ...state, selectedSeat: action.seat };

    case "SET_BOOKING":
      return {
        ...state,
        passenger: action.passenger,
        selectedFlightId: action.flightId,
        bookedFareClass: action.bookedFareClass,
      };

    case "ACCEPT_UPGRADE":
      return { ...state, hasPaidUpgrade: true };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// The actual context object — holds state and dispatch together so consumers
// can both read values and trigger updates
interface BookingContextValue {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

// Wraps the app (or the relevant part of it) so any nested component can
// access booking state via useBooking() below
export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

// Custom hook so components don't need to import useContext + BookingContext
// separately every time, and so we can throw a clear error if it's used
// outside the provider (instead of a confusing "undefined" bug later)
export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
