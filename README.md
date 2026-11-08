# Kagura Ashen Remnant Tracker — Feast of Eternity Event Companion

A deterministic mathematical pacing engine, daily event roadmap checklist, diamond budget manager, and real-money expenditure ledger for Mobile Legends: Bang Bang players targeting the Kagura Legend Skin (1,600 Ashen Remnants).

Built with React 19, TypeScript, Tailwind CSS, and Vite.

---

## Overview

During the MLBB Feast of Eternity event, players pull to collect **1,600 Ashen Remnants** to claim the Kagura Legend Skin. Because the event awards up to 105 one-time milestone remnants at 15, 20, 30, 40, and 50 draws, simply dividing current remnants by draw count distorts the player's actual RNG draw rate.

This tracker isolates the true remnant average per draw by deducting claimed milestone bonuses, benchmarks the result against realistic draw targets (100, 110, and 115 draws), and tracks every daily pull, diamond expenditure, and real-money recharge across the entire 31-day event schedule.

---

## Key Features

### 1. Remnant Pacing Calculator
* **True Rate Calculation**: Isolates draw-generated remnants from fixed milestone rewards:
  $$\text{True Average} = \frac{\text{Current Remnants} - \text{Claimed Milestones}}{\text{Completed Draws}}$$
* **Three Strategic Benchmarks**:
  * **Optimistic Target (100 Draws)**: Requires $\ge 14.95$ remnants/draw.
  * **Tipid Backup Target (110 Draws)**: Requires $13.5909$ remnants/draw.
  * **Extended Target (115 Draws)**: Requires $13.00$ remnants/draw.
  * **Below Extended Pace**: $< 13.00$ remnants/draw.
* **Sample Size Reliability**: Flags early variance ($< 15$ draws) and rates sample confidence up to $\ge 50$ draws where all milestones unlock.
* **Forecast Projections**: Calculates projected remnants at target milestones and remaining required remnant rates.
* **Dual Input Modes**: Manual entry or one-click sync from the Daily Tipid Plan ledger.
* **Milestone Override Panel**: Allows toggling individual milestones between claimed and unclaimed states.

### 2. Daily Tipid Plan Checklist (Nov 6 – Dec 6, 2026)
* **31-Day Roadmap**: Pre-populated with the Kagura Tipid schedule, covering:
  * Mega Draw Bundles (Days 1–4).
  * Daily 50% discount single pulls (Days 1–30).
  * Phase 1 Premium Supply recharge event (Nov 13).
  * Phase 2 Premium Supply recharge event (Nov 20).
* **Interactive Task Actions**: Mark dates as `Done`, `Pending`, `Skip`, or customize actual draws, diamonds, and PHP paid.
* **Collapsible Notes**: Strategic tips for each day including conversion rates, bundle mechanics, and recharge tier advice.
* **Filter Views**: View all dates, pending dates, or completed dates.

### 3. Diamond Budget & Real-Money Expense Tracker
* **Blue Diamond Accounting**: Tracks planned 2,348–2,387 Blue Diamond consumption (bundles, daily draws, Phase 1 & 2 single draws).
* **Promo Diamond Isolation**: Explicitly separates Promo Diamonds from Blue Diamonds (800 unlocked from 1,000 recharge tier, 1,600 consumed on Day 8).
* **100 vs. 110 Draw Comparison**: Models additional diamond requirements if the 110-draw backup target is utilized.
* **Real-Money Expense Tracker (PHP)**:
  * Compares actual spending against the ₱2,384.62 – ₱2,392.63 ceiling (7 Weekly Diamond Passes + Phase 1 & 2 recharges).
  * Real-time variance indicator (under-budget balance vs. budget overflow).
  * Interactive purchase logging ledger with date, pack tier, diamonds received, and amount paid.

### 4. Plan vs. Actual Performance Dashboard
* Cross-examines checklist logs and purchase history against the master schedule.
* 4-metric progress matrix:
  * **Draw Progress**: Actual draws completed vs. planned to date.
  * **Diamond Progress**: Blue Diamonds spent vs. planned baseline.
  * **Financial Progress**: Actual PHP spent vs. planned ceiling.
  * **Remnant Progress**: Remnants collected vs. 1,600 goal.
* Automated narrative analysis generating contextual pace insights.

### 5. Client-Side Deterministic Privacy & Backup
* **100% Offline**: Deterministic client engine. No external accounts, servers, or third-party APIs required.
* **LocalStorage Persistence**: Auto-saves calculator inputs, checklist statuses, and purchase history.
* **JSON Export & Import**: Download a portable backup file and restore state across any device.
* **Scoped Reset Modal**: Reset all data, or selectively clear only the calculator, checklist, or budget ledger.

---

## Mathematical Benchmarks

The 1,600 remnant target includes 105 remnants awarded through guaranteed milestone rewards:

| Milestone Threshold | Remnant Reward | Cumulative Reward |
|:---|:---:|:---:|
| 15 Draws | +15 | 15 |
| 20 Draws | +15 | 30 |
| 30 Draws | +15 | 45 |
| 40 Draws | +30 | 75 |
| 50 Draws | +30 | 105 |

Normal pulls must generate:
$$1,600 - 105 = 1,495 \text{ remnants}$$

Required averages per draw target:
* **100 Draws (Optimistic)**: $1,495 / 100 = 14.95\text{ remnants/draw}$
* **110 Draws (Tipid Backup)**: $1,495 / 110 = 13.5909\text{ remnants/draw}$
* **115 Draws (Extended Target)**: $1,495 / 115 = 13.00\text{ remnants/draw}$

---

## Tech Stack

* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite 6
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Testing**: Vitest + React Testing Library + jsdom
* **Storage**: LocalStorage with JSON Export/Import

---

## Getting Started

### Prerequisites
* Node.js 18+
* npm or pnpm

### Installation

```bash
git clone https://github.com/SODAAAH/topup.git
cd topup
npm install
```

### Development Server

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

Execute the automated test suite (24 unit and integration tests):

```bash
npm test
```

### Production Build

Compile TypeScript and build the optimized production assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Project Structure

```text
topup/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── CalculatorForm.tsx
│   │   ├── ConfidenceIndicator.tsx
│   │   ├── DetailedStats.tsx
│   │   ├── DiamondBudgetTracker.tsx
│   │   ├── Header.tsx
│   │   ├── HelpAccordion.tsx
│   │   ├── MilestoneSettings.tsx
│   │   ├── NavigationTabs.tsx
│   │   ├── PlanVsActualDashboard.tsx
│   │   ├── ProjectionComparison.tsx
│   │   ├── ResetConfirmModal.tsx
│   │   ├── TipidPlanChecklist.tsx
│   │   └── VerdictBadge.tsx
│   ├── config/
│   │   ├── eventConfig.ts
│   │   └── tipidPlanConfig.ts
│   ├── types/
│   │   └── tracker.ts
│   ├── utils/
│   │   ├── calculator.ts
│   │   └── storage.ts
│   └── __tests__/
│       ├── App.test.tsx
│       ├── calculator.test.ts
│       └── tipidPlan.test.ts
```

---

## License

MIT
