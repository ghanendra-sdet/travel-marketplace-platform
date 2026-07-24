# Travel Marketplace Platform — UI Consistency

> Price, availability, and booking-status data surfaces across Search, Selection, Booking
> Confirmation, and Itinerary Management (see [`business-overview.md`](./business-overview.md)).
> This document covers whether it's represented **consistently** across all of them.

## Why This Matters More Here Than in Most Modules

Per [`business-overview.md`](./business-overview.md) section 4, this product's central risk is
stale pricing and overbooking — both silent failure modes. The UI is the traveler's only signal
for whether the price they're about to pay is still valid, or whether their booking is truly
confirmed. Inconsistent price or status display doesn't just look sloppy — it directly determines
whether a traveler trusts the platform enough to complete payment.

## 1. Booking Status Representation Consistency

| Status | Expected Label | Expected Color (convention) |
|---|---|---|
| Fare locked, awaiting payment | "Price Held" | Amber |
| Hold expired | "Price Expired — Please Re-search" | Red — must be visually distinct from a payment failure |
| Booking confirmed | "Confirmed" | Green |
| Cancelled | "Cancelled" | Grey/neutral |
| Refund processed | "Refunded" | Green — distinct from "Confirmed" |

## 2. Price Formatting Consistency

| Element | Convention to Verify |
|---|---|
| Currency symbol | Consistent placement across Search results, Selection, Payment, and Itinerary |
| Decimal places | Always 2 decimal places, no screen truncating to whole units |
| Fee/tax breakdown | Identical line-item labels (base fare, taxes, fees) across Selection and the final Payment confirmation |

## 3. Terminology Consistency

Per the glossary in [`business-overview.md`](./business-overview.md), watch for drift on:

- "PNR" vs. "Booking Reference" vs. "Confirmation Number" used interchangeably for the same
  concept
- "Fare Lock" vs. "Price Hold" vs. "Reservation Hold" as different labels for the same mechanism
- "Refund" vs. "Cancellation Credit" as different labels for the same outcome

## 4. Fare-Lock Countdown Consistency

Per [`architecture-and-flow.md`](./architecture-and-flow.md), a fare lock has a limited window.
This introduces its own consistency requirement:

- If a countdown timer is shown, it must reflect the platform's actual hold-expiry time exactly —
  never a cosmetic timer that drifts from the real enforcement deadline
- The price shown during the hold must never silently change; if it must change, the traveler
  needs an explicit, unmissable notice, not a quiet update

## 5. Empty States & Error Messages

- Does Search show a deliberate "no results" empty state distinct from a supplier-API error?
- Is the "this fare is no longer available" message worded consistently regardless of which
  supplier (airline/hotel) triggered it?

## 6. Cross-Browser & Responsive Consistency

- Do price displays and status badges render identically across Chrome, Firefox, and
  Safari/WebKit?
- Does the Search results grid degrade gracefully on smaller viewports without losing
  price/availability visibility?

## 7. Accessibility Consistency

- Are Price Held/Expired/Confirmed/Cancelled/Refunded states distinguishable by more than color
  alone?

---

## Coverage Mapping

See [`../regression-checklist.md`](../regression-checklist.md) section 5 for the UI consistency
test cases derived from this document.
