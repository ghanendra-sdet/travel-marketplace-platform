# Travel Marketplace Platform — Automation Framework

> Automated scenarios trace directly to [`../regression-checklist.md`](../regression-checklist.md)
> sections 2–3 (fare lock/booking + overbooking prevention). See
> [`../docs/README.md`](../docs/README.md) for the full documentation map.

Automation for the search-to-booking journey, built with **Cypress + JavaScript**, backed by
Postman API coverage and k6 for load/concurrency scenarios.

## Why This Combination

- Cypress covers the UI-heavy search, selection, and payment flows
- Postman covers API-level fare-lock and booking-confirmation validation
- **k6** specifically exists to simulate the concurrent-booking race condition (two requests for
  the same inventory unit within milliseconds) that a standard UI test tool can't reliably
  reproduce — see [`../docs/architecture-and-flow.md`](../docs/architecture-and-flow.md) for why
  overbooking prevention is a concurrency-testing problem

## Suggested Project Structure

```
automation/
├── README.md
├── cypress.config.js
├── cypress/
│   ├── e2e/
│   │   └── sample-booking-flow.cy.js
│   ├── fixtures/
│   │   └── dummy-search-results.json
│   └── support/
└── k6/
    └── concurrent-booking-race.js   ← simulates simultaneous fare-lock attempts on one unit
```

> This repo currently includes one representative sample (`sample-booking-flow.spec.ts`, written
> in Cypress-compatible style) rather than the full framework, to keep the portfolio focused.

## Test Data Policy

All automation uses **dummy data only**: dummy routes, dates, and hotel/flight inventory —
mocked supplier responses (including simulated timeouts and stale-price scenarios) rather than
hitting any real supplier.

## Priority Automated Scenarios

1. Search happy path (flights and hotels)
2. Fare lock → payment → booking confirmation
3. Payment blocked after hold expiry
4. Cancellation → refund quote → refund processed
5. Overbooking prevention (concurrent booking simulation via k6)
