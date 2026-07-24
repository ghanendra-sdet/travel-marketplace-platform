# Travel Marketplace Platform — Architecture & Flow

> See [`business-overview.md`](./business-overview.md) for why price/availability integrity is
> this product's central risk, and [`README.md`](./README.md) for the full documentation map.

## Search-to-Booking Flow

```
Traveler searches (flights / hotels / packages, with filters)
      │
      ▼
Platform queries live Supplier Inventory APIs (GDS / hotel systems)
      │
      ▼
Results displayed with current price & availability
      │
      ▼
Traveler selects an option
      │
      ▼
Fare Lock / Hold triggered — price + inventory unit reserved for a short window
      │
      ▼
Traveler completes Payment
      │
      ├──▶ Payment completes within the hold window ──▶ Booking CONFIRMED, PNR generated,
      │                                                   charged price == fare-locked price
      │
      └──▶ Hold window expires before payment completes ──▶ Booking BLOCKED, traveler must
                                                              re-search for current price/availability
```

**Key testing principle:** the amount charged at payment time must always match the fare-locked
price shown at selection time — if the hold window expires, the platform must block payment and
force a re-search, never silently charge a possibly-stale price or confirm a booking against
inventory that may no longer be available.

## Cancellation & Refund Flow

```
Traveler requests cancellation
      │
      ▼
Refund Policy Engine evaluates the booking's fare type and cancellation timing
      │
      ▼
Refund Policy Tier applied (e.g. full refund / partial refund / non-refundable)
      │
      ▼
Refund amount calculated and communicated to traveler BEFORE confirming cancellation
      │
      ▼
Traveler confirms ──▶ Booking CANCELLED, refund initiated via Payment Gateway
      │
      ▼
Supplier notified of cancellation (inventory unit released back to supplier)
```

**Key testing principle:** the refund amount shown before confirmation must exactly match the
amount actually refunded — no last-second policy-tier change after the traveler has already seen
and accepted a quoted refund figure.

## Why Overbooking Prevention Is a Concurrency Testing Problem

Two travelers can attempt to book the same last-available seat/room within milliseconds of each
other. The Fare Lock/Hold Service must guarantee only one of them succeeds — this makes
overbooking prevention fundamentally a **concurrency correctness** problem, not just a functional
one, and it needs test scenarios that deliberately race two booking attempts against the same
inventory unit rather than only testing sequential bookings.

## System Interaction Map

```
   ┌──────────┐        ┌───────────────────────┐        ┌──────────────────┐
   │ Traveler  │◀──────▶│  Travel Marketplace     │◀──────▶│ Supplier (GDS /   │
   └──────────┘        │  (Fare Lock/Hold, Booking│        │ Hotel Inventory)  │
                        │  Engine, Refund Engine)  │        └──────────────────┘
                        └───────────┬─────────────┘
                                    │
                                    ▼
                          ┌───────────────────┐
                          │  Payment Gateway    │
                          └───────────────────┘
```
