# ✈️ Travel Marketplace Platform

**A flight, hotel & package booking marketplace — QA & Automation Portfolio Project**

> This repository documents the QA strategy, test automation, and testing approach behind a
> sample **Travel & Booking Marketplace** application that lets travelers search, compare, and
> book flights, hotels, and packages across multiple third-party suppliers through one unified
> interface.
>
> All content here uses **generic/sample data only**. No client names, company names, or
> confidential/production information appear anywhere. Dates and timelines are placeholders —
> update `[Timeline]` before publishing.
>
> 📍 **New here?** [`docs/README.md`](./docs/README.md) is a documentation map — it answers what
> this is, how it works, who's involved, and what it depends on, with a suggested reading order
> through the rest of the repo.

---

## 📖 Table of Contents

1. [What is a Travel Marketplace?](#-what-is-a-travel-marketplace)
2. [My Role](#-my-role)
3. [Tech Stack & Tools Used](#-tech-stack--tools-used)
4. [Types of Testing Performed](#-types-of-testing-performed)
5. [How It Works — Search-to-Booking Flow](#-how-it-works--search-to-booking-flow)
6. [Key Achievements](#-key-achievements)
7. [Automation Approach](#-automation-approach)
8. [Regression Checklist](#-regression-checklist)
9. [Screenshots & Reports](#-screenshots--reports)
10. [Repository Structure](#-repository-structure)

> For deeper dives not covered inline here: [Modules, Submodules & Stakeholders](./docs/business-overview.md),
> [Architecture, Flow & Sequence Diagrams](./docs/architecture-and-flow.md),
> [Tech Stack & Skills Demonstrated](./docs/tech-and-skills.md), [UI Consistency](./docs/ui-consistency.md)
> — or see [`docs/README.md`](./docs/README.md) for the full map. Every diagram in this repo is
> drawn in Mermaid and renders directly on GitHub.

---

## 💡 What is a Travel Marketplace?

A Travel Marketplace lets a traveler search, compare, and book flights, hotels, and packages
across many third-party suppliers — airlines, hotels, travel operators — through one unified
interface, instead of checking each supplier's own site individually.

Think of it as a single storefront reselling inventory it doesn't own. The core testing challenge
follows directly from that: prices and availability are controlled by external suppliers and can
change at any moment, so the platform has to guarantee that what a traveler is quoted is exactly
what they're charged, and that two travelers can never both "win" the same last seat or room.

### Core Flow

1. **Search** — traveler searches flights/hotels/packages with filters
2. **Selection** — traveler picks an option; price and availability shown as of that moment
3. **Fare Lock / Hold** — the selected price and inventory unit are held for a short window
4. **Payment** — traveler pays; the platform must charge exactly the fare-locked price
5. **Booking Confirmation** — a PNR/booking reference is generated
6. **Itinerary** — traveler can view, manage, or cancel the booking afterward

### Who typically interacts with it?

| Role | What they do |
|---|---|
| **Traveler / Customer** | Searches, books, pays, manages, and cancels their own bookings |
| **Travel Partner / Supplier** | Provides real-time inventory and pricing; fulfills the booking |
| **Platform Admin/Ops** | Manages supplier onboarding, monitors booking-success rates |

---

## 👤 My Role

QA Engineer / SDET responsible for the Travel Marketplace module, owning manual and automated
test coverage across search accuracy, fare-lock integrity, and overbooking prevention.

- Owned QA strategy for the search → fare lock → payment → confirmation → cancellation journey
- Designed and executed automation covering fare-lock timing and concurrent-booking scenarios
- Ran API testing validating fare-lock responses, payment payloads, and booking confirmations
  against supplier-side behavior
- Focused test design on price/availability integrity — a defect category largely rooted in
  external supplier systems, but still the platform's responsibility to guard against
- Logged, triaged, and tracked defects through their full lifecycle

**Timeline:** `[Add Duration]`

---

## 🛠 Tech Stack & Tools Used

| Category | Tools |
|---|---|
| **UI Automation** | Cypress, JavaScript |
| **API Testing & Automation** | Postman, Cypress `cy.intercept`-based contract assertions |
| **Performance/Concurrency Testing** | k6 |
| **Bug Tracking** | JIRA |
| **Version Control** | Git, GitHub |

> For why each tool was chosen for this product's specific risk profile, a skill-to-proof map,
> and the performance/concurrency testing approach in full:
> [`docs/tech-and-skills.md`](./docs/tech-and-skills.md).

---

## 🧪 Types of Testing Performed

- **Functional Testing** — search, selection, fare lock, payment, cancellation
- **Regression Testing** — the full search-to-cancellation suite, run before every release
- **API Testing** — search responses, fare-lock payloads, booking confirmations
- **Negative Testing** — supplier timeout during search, stale price at payment time, expired
  fare lock
- **Concurrency Testing** — simultaneous booking attempts on the same limited inventory unit,
  validated with k6 (see [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md)
  section 5 for the exact race condition, and
  [`docs/tech-and-skills.md`](./docs/tech-and-skills.md) section 5 for the full load/spike/soak
  approach)
- **Performance/Load Testing** — search-traffic load and spike scenarios, since booking demand is
  notably bursty around fare-drop alerts and seasonal surges
- **Cross-Browser Testing**
- **Smoke & Sanity Testing** — post-deployment health checks

---

## 🔄 How It Works — Search-to-Booking Flow

```mermaid
flowchart TD
    A["🔎 Search<br/>traveler searches flights/hotels/packages with filters"] --> B["📡 Live query to<br/>Supplier Inventory APIs (GDS / hotel systems)"]
    B -->|timeout/error| B1["⚠️ Clear error shown —<br/>no stale results ever treated as current"]
    B --> C["🧭 Selection<br/>traveler picks an option; price/availability shown as of that moment"]
    C --> D["🔒 Fare Lock / Hold<br/>price + inventory unit reserved for a short window"]
    D -->|payment within the hold window| E["✅ Charged price == fare-locked price"]
    D -->|hold window expires| F["🚫 Payment blocked — traveler must re-search"]
    E --> G["🎫 Booking Confirmation<br/>PNR/booking reference generated"]
    G --> H["📋 Itinerary<br/>view, manage, or cancel — cancellation triggers the Refund Policy Engine"]

    classDef warn fill:#e65100,stroke:#fb8c00,color:#fff
    classDef good fill:#1b5e20,stroke:#43a047,color:#fff
    classDef bad fill:#b71c1c,stroke:#e53935,color:#fff
    classDef lock fill:#4a148c,stroke:#8e24aa,color:#fff
    class B1 warn
    class E,G good
    class F bad
    class D lock
```

The amount charged at payment time has to always match the fare-locked price shown at selection
time, and only one traveler can ever successfully confirm a booking against a given limited
inventory unit. See [`docs/business-overview.md`](./docs/business-overview.md) section 4 for the
full rationale, and [`docs/architecture-and-flow.md`](./docs/architecture-and-flow.md) for the
complete set of sequence diagrams — search, fare-lock, payment, the overbooking race condition
itself, and cancellation/refund — showing exactly how each step is enforced.

### Admin Functions

- Supplier onboarding & inventory feed integration
- Booking-success rate monitoring
- Refund policy configuration
- Reports

---

## 🏆 Key Achievements

- Designed a search-to-booking regression suite treating price/availability integrity — stale
  pricing, overbooking — as first-class test scenarios rather than edge cases
- Built a concurrency test approach via k6 specifically to catch overbooking defects that
  sequential UI testing alone can't reproduce
- Validated cancellation/refund accuracy against fare-type-specific policy tiers
- Logged and tracked defects across fare-lock timing and overbooking-prevention themes

---

## 🤖 Automation Approach

Automation is built with **Cypress + JavaScript**, backed by Postman API coverage and k6 for
concurrency scenarios.

### Priority Automated Scenarios

1. Search happy path (flights and hotels)
2. Fare lock → payment → booking confirmation
3. Payment blocked after hold expiry
4. Cancellation → refund quote → refund processed
5. Overbooking prevention (concurrent booking simulation)

See [`automation/`](./automation) for the framework README and a sample spec file using dummy
data.

---

## ✅ Regression Checklist

- [ ] Search & Discovery (flights / hotels / packages)
- [ ] Fare Lock & Booking
- [ ] Overbooking Prevention (concurrent booking race conditions)
- [ ] Cancellation & Refund
- [ ] Itinerary Management
- [ ] Payment Gateway Integration
- [ ] UI Consistency (status labeling, price formatting, terminology, accessibility)

Full checklist with edge cases: [`regression-checklist.md`](./regression-checklist.md).

---

## 📸 Screenshots & Reports

Sample test execution reports and defect report templates live in
[`regression-execution-summary.md`](./regression-execution-summary.md) and
[`sample-defect-report.md`](./sample-defect-report.md).

---

## 📁 Repository Structure

> **New here?** Start with [`docs/README.md`](./docs/README.md) — a documentation map that points
> to exactly the right doc for each question you're likely to have.

```
travel-marketplace-platform/
├── README.md
├── regression-checklist.md          → Full regression suite + edge cases
├── sample-defect-report.md          → Defect theme taxonomy + worked defect examples
├── regression-execution-summary.md  → Sample regression test execution report
├── docs/
│   ├── README.md                    → 📍 Documentation map — start here
│   ├── business-overview.md         → What this is, modules/submodules, stakeholders, dependencies, glossary, price-integrity risk model
│   ├── architecture-and-flow.md     → Mermaid sequence/flow diagrams: search, fare-lock, payment, overbooking race condition, cancellation/refund
│   ├── tech-and-skills.md           → Full tech stack (with why), skill → proof map, testing pyramid, CI/CD shape, performance/concurrency depth
│   └── ui-consistency.md            → Cross-screen UI/UX consistency (booking status, price formatting, a11y)
└── automation/
    ├── README.md                    → Framework setup & structure
    └── sample-booking-flow.spec.ts  → Sample Cypress test (dummy data)
```

> **Note on structure:** `bug-reports/`, `test-cases/`, and `test-reports/` started as empty
> placeholder folders and were flattened away once real content existed — a folder holding one
> file (or none) adds navigation overhead without organizing anything. `docs/` and `automation/`
> stayed as folders because each genuinely groups several related files.
