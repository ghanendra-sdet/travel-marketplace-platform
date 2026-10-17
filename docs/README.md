# Travel Marketplace Platform — Documentation Map

> New to this repo? Start here. This page points straight to the doc that answers whatever
> question you actually have.

| Question | Answer |
|---|---|
| What is this, in plain terms? | [`business-overview.md`](./business-overview.md) sections 1–2 |
| Who's involved / stakeholders? | [`business-overview.md`](./business-overview.md) section 5 |
| What does it depend on? | [`business-overview.md`](./business-overview.md) section 6 |
| How does search-to-booking actually work — with real sequence diagrams? | [`architecture-and-flow.md`](./architecture-and-flow.md) |
| What's the highest-risk testing theme? | [`business-overview.md`](./business-overview.md) section 4 (price/availability integrity) |
| What are the modules and submodules? | [`business-overview.md`](./business-overview.md) section 2 |
| What tech was used, and what skills does this repo demonstrate? | [`tech-and-skills.md`](./tech-and-skills.md) |
| How does overbooking prevention actually work under the hood (locking/concurrency)? | [`architecture-and-flow.md`](./architecture-and-flow.md) section 5 |
| What does the UI need to get right, consistently? | [`ui-consistency.md`](./ui-consistency.md) |
| What's actually tested? | [`../regression-checklist.md`](../regression-checklist.md) |
| What's automated? | [`../automation/README.md`](../automation/README.md) |
| What does a realistic defect report look like? | [`../sample-defect-report.md`](../sample-defect-report.md) |
| What does a regression execution report look like? | [`../regression-execution-summary.md`](../regression-execution-summary.md) |

## Business Flow vs. Tech Flow vs. User Flow

- **Business Flow** — why a marketplace model exists at all. The platform doesn't own flight seats
  or hotel rooms; it aggregates and resells access to inventory it doesn't control, which is why
  price/availability integrity, not just search UX, is the core commercial risk. See
  [`business-overview.md`](./business-overview.md) sections 1 and 4.
- **Tech Flow** — how search, fare-lock, payment, and booking confirmation actually execute
  against live supplier inventory, and why overbooking prevention is a concurrency problem. See
  [`architecture-and-flow.md`](./architecture-and-flow.md).
- **User Flow** — what a traveler actually clicks through: Search, Select, Price Held (fare lock),
  Pay, Confirmed, and later view or cancel via Itinerary. See the README's
  [How It Works](../README.md#-how-it-works--search-to-booking-flow) section.

## Reading Order

```
README.md (repo root)
      │
      ▼
docs/business-overview.md      ← what this is, modules/submodules, price/availability integrity
      │                            risk, stakeholders
      ▼
docs/architecture-and-flow.md  ← search-to-booking + cancellation/refund flow, overbooking risk,
      │                            with real Mermaid sequence diagrams
      ▼
docs/tech-and-skills.md        ← full tech stack, skill → proof map, CI/CD shape, performance testing depth
      │
      ▼
docs/ui-consistency.md         ← fare-lock and booking-status UI consistency
      │
      ▼
regression-checklist.md → sample-defect-report.md → regression-execution-summary.md → automation/README.md
```
