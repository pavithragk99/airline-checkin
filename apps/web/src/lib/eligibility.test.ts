/**
 * eligibility.test.ts
 * Unit tests for the eligibility and pricing rules. These are pure functions
 * with no UI or network involved, so they're fast and simple to test directly.
 */

import { describe, it, expect } from "vitest";
import { isCheckinOpen, isExitRowEligible, getSeatPrice } from "./eligibility";

describe("isCheckinOpen", () => {
  it("returns false before the check-in window opens", () => {
    const flight = {
      departureTime: "2026-08-01T12:00:00.000Z",
      checkinOpensHoursBefore: 24,
    };
    // Now is 30 hours before departure — window hasn't opened yet (opens at 24h before)
    const now = new Date("2026-07-31T06:00:00.000Z");
    expect(isCheckinOpen(flight, now)).toBe(false);
  });

  it("returns true right when the check-in window opens", () => {
    const flight = {
      departureTime: "2026-08-01T12:00:00.000Z",
      checkinOpensHoursBefore: 24,
    };
    // Exactly 24 hours before departure
    const now = new Date("2026-07-31T12:00:00.000Z");
    expect(isCheckinOpen(flight, now)).toBe(true);
  });

  it("returns false after departure", () => {
    const flight = {
      departureTime: "2026-08-01T12:00:00.000Z",
      checkinOpensHoursBefore: 24,
    };
    const now = new Date("2026-08-01T13:00:00.000Z");
    expect(isCheckinOpen(flight, now)).toBe(false);
  });
});

describe("isExitRowEligible", () => {
  it("allows anyone when tier has no age restriction", () => {
    const tier = { price: 0, minAge: null, eliteFree: false };
    expect(isExitRowEligible(10, tier)).toBe(true);
  });

  it("blocks passengers under the minimum age", () => {
    const tier = { price: 45, minAge: 15, eliteFree: false };
    expect(isExitRowEligible(12, tier)).toBe(false);
  });

  it("allows passengers at or above the minimum age", () => {
    const tier = { price: 45, minAge: 15, eliteFree: false };
    expect(isExitRowEligible(15, tier)).toBe(true);
  });
});

describe("getSeatPrice", () => {
  it("charges list price for non-elite passengers", () => {
    const tier = { price: 75, minAge: null, eliteFree: true };
    expect(getSeatPrice(tier, false)).toBe(75);
  });

  it("gives elite passengers a free upgrade on eligible tiers", () => {
    const tier = { price: 75, minAge: null, eliteFree: true };
    expect(getSeatPrice(tier, true)).toBe(0);
  });

  it("still charges elite passengers for tiers that aren't elite-free", () => {
    const tier = { price: 45, minAge: 15, eliteFree: false };
    expect(getSeatPrice(tier, true)).toBe(45);
  });
});
