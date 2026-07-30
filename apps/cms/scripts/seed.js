/**
 * seed.js
 *
 * Seeds all demo content into Strapi: aircraft types, seat tiers,
 * checkin steps, and flights. Safe to run more than once — it looks
 * for existing entries by name/key first and updates them instead of
 * creating duplicates. Flight departure times are always set relative
 * to the moment the script runs, so they never go stale.
 *
 * Usage:
 *   node scripts/seed.js
 *
 * Requires STRAPI_SEED_URL and STRAPI_SEED_TOKEN in .env (or set as
 * real environment variables when running against production).
 */

require("dotenv").config();

const STRAPI_URL = process.env.STRAPI_SEED_URL;
const TOKEN = process.env.STRAPI_SEED_TOKEN;

if (!STRAPI_URL || !TOKEN) {
  console.error("Missing STRAPI_SEED_URL or STRAPI_SEED_TOKEN in .env");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

// Generic helper: look for an existing entry by a unique field, create
// it if missing, or update it if found. Keeps the script safe to re-run.
async function findOrCreate(collection, filterField, filterValue, data) {
  const searchUrl = `${STRAPI_URL}/api/${collection}?filters[${filterField}][$eq]=${encodeURIComponent(
    filterValue
  )}`;
  const searchRes = await fetch(searchUrl, { headers });
  const searchJson = await searchRes.json();

  if (searchJson.data && searchJson.data.length > 0) {
    const existing = searchJson.data[0];
    const updateRes = await fetch(`${STRAPI_URL}/api/${collection}/${existing.documentId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ data }),
    });
    const updated = await updateRes.json();
    console.log(`Updated ${collection}: ${filterValue}`);
    return updated.data;
  }

  const createRes = await fetch(`${STRAPI_URL}/api/${collection}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  const created = await createRes.json();
  if (!created.data) {
    console.error(`Failed to create ${collection}: ${filterValue}`, created);
    throw new Error(`Seeding failed for ${collection}/${filterValue}`);
  }
  console.log(`Created ${collection}: ${filterValue}`);
  return created.data;
}

async function findOrCreateSeatTier(name, aircraftDocumentId, data) {
  const searchUrl = `${STRAPI_URL}/api/seat-tiers?filters[name][$eq]=${encodeURIComponent(
    name
  )}&filters[aircraftType][documentId][$eq]=${aircraftDocumentId}`;
  const searchRes = await fetch(searchUrl, { headers });
  const searchJson = await searchRes.json();

  if (searchJson.data && searchJson.data.length > 0) {
    const existing = searchJson.data[0];
    const updateRes = await fetch(`${STRAPI_URL}/api/seat-tiers/${existing.documentId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ data }),
    });
    const updated = await updateRes.json();
    console.log(`Updated seat-tier: ${name} (${aircraftDocumentId})`);
    return updated.data;
  }

  const createRes = await fetch(`${STRAPI_URL}/api/seat-tiers`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  const created = await createRes.json();
  console.log(`Created seat-tier: ${name} (${aircraftDocumentId})`);
  return created.data;
}

// Shared seat map generator so A320/A321 layouts aren't duplicated by hand
function buildSeatMap(rows) {
  const seatMap = [];
  for (let row = 1; row <= rows; row++) {
    let tier = "economy";
    if (row <= 2) tier = "premium";
    else if (row === 3) tier = "exitRow";

    seatMap.push({
      rowNumber: row,
      seats: ["A", "B", "C", "D", "E", "F"].map((letter) => ({
        letter,
        type: letter === "A" || letter === "F" ? "window" : letter === "C" || letter === "D" ? "aisle" : "middle",
        tier,
        exitRow: row === 3,
      })),
    });
  }
  return seatMap;
}

async function seed() {
  console.log(`Seeding Strapi at ${STRAPI_URL}...\n`);

  // 1. Aircraft Types
  const a320 = await findOrCreate("aircraft-types", "name", "Airbus A320", {
    name: "Airbus A320",
    rows: 6,
    seatMap: buildSeatMap(6),
  });

  const a321 = await findOrCreate("aircraft-types", "name", "Airbus A321", {
    name: "Airbus A321",
    rows: 8,
    seatMap: buildSeatMap(8),
  });

  // 2. Seat Tiers — linked via the aircraft's documentId
  await findOrCreateSeatTier("Economy", a320.documentId, {
  name: "Economy",
  price: 0,
  minAge: null,
  eliteFree: false,
  aircraftType: a320.documentId,
});
await findOrCreateSeatTier("Exit Row", a320.documentId, {
  name: "Exit Row",
  price: 45,
  minAge: 15,
  eliteFree: false,
  aircraftType: a320.documentId,
});
await findOrCreateSeatTier("Premium", a320.documentId, {
  name: "Premium",
  price: 75,
  minAge: null,
  eliteFree: true,
  aircraftType: a320.documentId,
});

await findOrCreateSeatTier("Economy", a321.documentId, {
  name: "Economy",
  price: 0,
  minAge: null,
  eliteFree: false,
  aircraftType: a321.documentId,
});
await findOrCreateSeatTier("Exit Row", a321.documentId, {
  name: "Exit Row",
  price: 55,
  minAge: 15,
  eliteFree: false,
  aircraftType: a321.documentId,
});
await findOrCreateSeatTier("Premium", a321.documentId, {
  name: "Premium",
  price: 85,
  minAge: null,
  eliteFree: true,
  aircraftType: a321.documentId,
});

  // 3. Checkin Steps
  await findOrCreate("checkin-steps", "stepKey", "documents-domestic", {
    stepKey: "documents-domestic",
    order: 1,
    title: "Travel Documents",
    body: "Please confirm you have a valid government-issued photo ID for domestic travel. No additional documentation is required for this destination.",
    destinationCountry: "Canada",
    requiresVisa: false,
  });
  await findOrCreate("checkin-steps", "stepKey", "documents-international", {
    stepKey: "documents-international",
    order: 1,
    title: "Travel Documents",
    body: "A valid passport is required, and your destination requires a visa. Please confirm your visa has been approved before continuing check-in.",
    destinationCountry: "Brazil",
    requiresVisa: true,
  });
  await findOrCreate("checkin-steps", "stepKey", "baggage", {
    stepKey: "baggage",
    order: 2,
    title: "Baggage Details",
    body: "Let us know if you're checking any bags. Carry-on allowance is one personal item and one standard carry-on per passenger.",
    destinationCountry: null,
    requiresVisa: false,
  });
  await findOrCreate("checkin-steps", "stepKey", "seat-preview", {
    stepKey: "seat-preview",
    order: 3,
    title: "Almost Done",
    body: "Your check-in is complete. Continue to select your seat.",
    destinationCountry: null,
    requiresVisa: false,
  });

  // 4. Flights — departure times computed relative to right now, so
  // they're always valid whenever this script runs
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;

  await findOrCreate("flights", "flightNumber", "PA 1425", {
    flightNumber: "PA 1425",
    origin: "Toronto (YYZ)",
    destination: "Montreal (YUL)",
    departureTime: new Date(now + 20 * HOUR).toISOString(),
    checkinOpensHoursBefore: 24,
    aircraftType: a320.documentId,
  });

  await findOrCreate("flights", "flightNumber", "PA 088", {
    flightNumber: "PA 088",
    origin: "Toronto (YYZ)",
    destination: "São Paulo (GRU)",
    departureTime: new Date(now + 48 * HOUR).toISOString(),
    checkinOpensHoursBefore: 24,
    aircraftType: a321.documentId,
  });

  console.log("\nSeeding complete.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});