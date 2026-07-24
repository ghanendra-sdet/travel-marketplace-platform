# Travel Marketplace Platform — Regression Checklist & Test Cases

> Sample regression suite structure with dummy data. Format: ID | Scenario | Steps | Expected Result.
> See [`docs/business-overview.md`](./docs/business-overview.md) for why price/availability
> integrity (section 4) is treated as a first-class scenario here, and
> [`docs/README.md`](./docs/README.md) for the full documentation map.

## 1. Search & Discovery

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-001 | Search flights with valid filters | 1. Search a dummy route/date with class filter applied | Results match the applied filters, current price/availability shown |
| TC-002 | Search hotels with valid filters | 1. Search a dummy destination/date range with rating filter applied | Results match filters, current price/availability shown |
| TC-003 | Search with no matching results | 1. Search a dummy combination with no matches | Deliberate "no results" empty state, not an error |
| TC-004 | Supplier API timeout during search | 1. Simulate a slow/unavailable dummy supplier feed | Clear "temporarily unavailable" message, no stale results shown as current |

## 2. Fare Lock & Booking

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-005 | Fare lock reserves price and inventory | 1. Select a dummy flight/hotel option | Price and availability held for the defined window; status shows "Price Held" |
| TC-006 | Payment within the hold window charges the locked price | 1. Complete payment before the hold expires | Charged amount exactly matches the fare-locked price |
| TC-007 | Payment attempted after hold expiry is blocked | 1. Wait past the hold window (test env) 2. Attempt payment | Payment blocked; traveler prompted to re-search for current price/availability |
| TC-008 | Booking confirmation generates a valid PNR | 1. Complete a successful booking | Unique PNR/booking reference generated and shown |

## 3. Overbooking Prevention (Highest Priority)

> Derived from [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md) — a concurrency
> correctness problem, not just a functional one.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-009 | Two simultaneous bookings for the last inventory unit | 1. Simulate two dummy travelers attempting to fare-lock the same last-available seat/room within milliseconds (test env) | Only one succeeds; the other sees an immediate "no longer available" message, never a false confirmation |
| TC-010 | Fare-locked inventory not offered to a second traveler during the hold | 1. Traveler A fare-locks the last unit 2. Traveler B searches the same option during the hold window | Traveler B sees it as unavailable/held, not bookable |

## 4. Cancellation & Refund

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-011 | Refund amount matches policy tier before confirmation | 1. Request cancellation on a dummy booking 2. Review the quoted refund amount | Quoted amount matches the applicable Refund Policy Tier exactly |
| TC-012 | Refunded amount matches the quote | 1. Confirm the cancellation | Actual refund processed matches the pre-confirmation quote exactly — no last-second change |
| TC-013 | Non-refundable fare correctly blocks a refund | 1. Attempt to cancel a dummy non-refundable booking | Clear messaging that no refund applies; cancellation still processed if requested |

## 5. UI Consistency

> Derived from [`docs/ui-consistency.md`](./docs/ui-consistency.md) — cross-screen consistency,
> not single-screen correctness.

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-014 | Booking status labeling consistency | 1. Compare "Price Held"/"Confirmed"/"Cancelled"/"Refunded" labels across Selection, Payment, and Itinerary | Identical labels and colors everywhere |
| TC-015 | Price formatting consistency | 1. View the same fare on Search, Selection, and Payment confirmation | Decimal places, currency symbol, and fee breakdown match exactly |
| TC-016 | Fare-lock countdown accuracy | 1. Compare the displayed countdown timer against the actual enforced hold-expiry time | Timer matches the real deadline exactly, no drift |
| TC-017 | Booking states distinguishable without color | 1. View Price Held/Expired/Confirmed/Cancelled/Refunded badges with color/grayscale rendering simulated | Each remains distinguishable via icon/text label alone |

## 6. Full Regression Checklist

- [ ] Search & Discovery (flights / hotels / packages)
- [ ] Fare Lock & Booking
- [ ] Overbooking Prevention (concurrent booking race conditions)
- [ ] Cancellation & Refund
- [ ] Itinerary Management
- [ ] Payment Gateway Integration
- [ ] UI Consistency (status labeling, price formatting, terminology, accessibility)

## 7. Priority Automation Candidates

1. Search happy path (flights and hotels)
2. Fare lock → payment → booking confirmation
3. Payment blocked after hold expiry
4. Cancellation → refund quote → refund processed
5. Overbooking prevention (concurrent booking simulation)

See [`automation/`](./automation) for the Cypress implementation.
