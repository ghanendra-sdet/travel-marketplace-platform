# Travel Marketplace Platform — Business Overview

> **Start here if you're new to fintech/travel-tech QA, in HR, or from a non-QA technical role.**
> This document explains what a travel marketplace does and why price/availability integrity is
> the central testing concern, before you look at any test case or code. See
> [`architecture-and-flow.md`](./architecture-and-flow.md) for the detailed flow and
> [`README.md`](./README.md) for the full documentation map.

## 1. What problem does it solve?

A Travel Marketplace lets a traveler search, compare, and book flights, hotels, and packages
across many different suppliers (airlines, hotels, travel operators) through one unified
interface — instead of checking each supplier's own site individually. The platform's core job is
reconciling **real-time, third-party inventory and pricing** (which it doesn't own or control)
into a single trustworthy booking experience.

## 2. Core Modules

- **Search & Discovery** — flight/hotel/package search with filters (dates, price, class, rating)
- **Fare/Rate Engine** — real-time pricing pulled from supplier inventory systems
- **Booking Engine** — fare lock/hold, seat/room reservation, booking confirmation, PNR generation
- **Payment & Refunds** — payment collection and tiered refund processing on cancellation
- **Itinerary Management** — the traveler's view of their own bookings, e-tickets, and vouchers
- **Cancellation & Refund Policy Engine** — applies fare-type-specific refund rules
- **Supplier/Inventory Management** — onboarding travel partners and integrating their rate/
  inventory feeds

## 3. Core Flow

1. **Search** — traveler searches flights/hotels/packages with filters
2. **Selection** — traveler picks an option; price and availability are shown as of that moment
3. **Fare Lock / Hold** — the selected price and inventory unit are held for a short window while
   the traveler completes payment
4. **Payment** — traveler pays; the platform must charge exactly the fare-locked price
5. **Booking Confirmation** — a PNR (Passenger Name Record) or booking reference is generated
6. **Itinerary** — traveler can view, manage, or cancel the booking afterward

## 4. Why Price/Availability Integrity Is the Central Testing Theme

The platform doesn't own the inventory it sells — flight seats, hotel rooms, and package slots
are controlled by external suppliers and can change or sell out at any moment. This creates two
distinct, high-severity risk categories:

- **Stale pricing** — the price shown at search time may no longer be valid by the time payment
  completes, if the fare-lock window isn't correctly enforced (conceptually the same risk as
  BBPS's stale-bill-amount problem — see the
  [BBPS repository](https://github.com/ghanendra-sdet/bbps-bill-payment-platform))
- **Overbooking** — two travelers attempting to book the last available seat/room concurrently
  must never both succeed; the fare-lock/hold mechanism exists specifically to prevent this

Both failure modes are silent until they cause real financial or customer-trust damage — a
traveler charged a stale price, or a confirmed booking that the supplier later can't honor.

## 5. Stakeholders / Involved Parties

| Stakeholder | Role in this module |
|---|---|
| **Traveler / Customer** | Searches, books, pays, manages, and cancels their own bookings |
| **Travel Partner / Supplier** (Airline, Hotel, Package Operator) | Provides real-time inventory and pricing; ultimately fulfills the booking |
| **Payment Gateway Provider** | Processes traveler payments and refunds |
| **Platform Admin/Ops** | Manages supplier onboarding, monitors booking-success rates and supplier feed health |
| **Finance/Reconciliation Team** | Reconciles platform-recorded bookings/refunds against supplier and payment-gateway records |
| **Customer Support Team** | Handles booking disputes, cancellation requests, and refund-policy questions |

## 6. Dependencies

### External Dependencies (Highest Blast-Radius)

- **Supplier Inventory APIs** (GDS for flights, hotel inventory systems) — the platform's pricing
  and availability accuracy is only as good as these real-time feeds; a stale or delayed supplier
  feed manifests as a booking-integrity defect even though the root cause is external
- **Payment Gateway** — payment collection and refund processing

### Internal Platform Dependencies

- **Fare Lock / Hold Service** — the mechanism preventing both stale pricing and overbooking; the
  single most load-bearing internal dependency in this platform
- **Notification Service** — booking confirmations, cancellation and refund-status alerts
- **Audit/Compliance** — refund-policy adherence tracking

## 7. Glossary

| Term | Meaning |
|---|---|
| **PNR (Passenger Name Record)** | The unique booking reference generated on confirmation |
| **Fare Lock / Hold** | A short window during which a selected price and inventory unit are reserved for the traveler completing payment |
| **GDS (Global Distribution System)** | A supplier-side system aggregating flight inventory across airlines |
| **Rate Parity** | The expectation that a supplier's price on the platform matches their price elsewhere |
| **Refund Policy Tier** | Fare-type-specific rules determining how much (if anything) is refunded on cancellation |
| **Overbooking** | More bookings confirmed for an inventory unit than actually exist |

## 8. Cross-Module Dependencies

- **Payment Gateway** — every booking and refund flows through this dependency; a gateway
  regression directly blocks bookings platform-wide
- **Supplier Inventory APIs** — see section 6; the platform's core trust guarantee rests on these
  external, uncontrolled systems
