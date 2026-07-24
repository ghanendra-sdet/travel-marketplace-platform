# Sample Defect Report — Travel Marketplace Platform

> Template + worked examples using dummy data. Reflects the price/availability-integrity defect
> theme that is the primary risk area for this module — see
> [`docs/business-overview.md`](./docs/business-overview.md) section 4 for why, and
> [`docs/README.md`](./docs/README.md) for the full documentation map.

---

## Defect #1

| Field | Value |
|---|---|
| **ID** | BUG-TRV-2011 (sample) |
| **Title** | Two travelers can both confirm a booking for the last available hotel room |
| **Severity** | Critical |
| **Module** | Travel Marketplace → Overbooking Prevention |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. As dummy Traveler A, select the last available room for a dummy hotel/date
2. Within the same fare-lock window, as dummy Traveler B, select the identical room
3. Both complete payment

**Expected Result**
Per [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md), the Fare Lock/Hold
Service must ensure only one traveler can successfully hold and pay for a given inventory unit —
the second attempt should see "no longer available" immediately upon selection.

**Actual Result**
Both Traveler A and Traveler B receive a confirmed booking and PNR for the same room — the fare
lock check happens only at initial selection, not re-verified atomically at payment completion,
so two concurrent holds can both proceed to confirmation.

**Impact**
A confirmed booking the supplier cannot actually honor — a severe customer-trust and potential
liability issue (compensation, rebooking costs) for a defect class this product should be
architected to make structurally impossible.

**Suggested Fix**
Make the fare-lock-to-confirmation sequence atomic at the inventory-unit level (e.g. a
database-level lock or optimistic-concurrency check at confirmation time), not just an
initial-selection-time check.

---

## Defect #2

| Field | Value |
|---|---|
| **ID** | BUG-TRV-2027 (sample) |
| **Title** | Payment succeeds at a stale price after the fare-lock window has expired |
| **Severity** | Major |
| **Module** | Travel Marketplace → Fare Lock & Booking |
| **Environment** | UAT (dummy data) |

**Steps to Reproduce**
1. Select a dummy flight, triggering a fare lock
2. Wait beyond the platform's hold window without refreshing
3. Proceed to pay the originally shown price

**Expected Result**
Per [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md), payment attempted after
hold expiry should be blocked, forcing a re-search for the current price.

**Actual Result**
Payment succeeds at the original, now-stale price — the expiry check only runs client-side (a
countdown timer) and isn't independently enforced server-side at the moment payment is
submitted.

**Impact**
The platform may honor a fare that no longer reflects real supplier pricing, creating a
margin/loss exposure and a rate-parity inconsistency with the supplier's own current pricing.

**Suggested Fix**
Enforce the hold-expiry check server-side at payment submission, independent of the client-side
countdown display — the client timer should be a UX convenience, never the actual enforcement
mechanism.

---

## Defect Reporting Template (blank)

| Field | Value |
|---|---|
| **ID** | |
| **Title** | |
| **Severity** | Minor / Major / Critical / Blocker |
| **Module** | |
| **Environment** | |

**Steps to Reproduce**
1.
2.
3.

**Expected Result**


**Actual Result**


**Impact**


**Suggested Fix**

