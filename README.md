# AAM Readiness Assessment — Keystone Heights Airport (42J)

An interactive readiness report for Advanced Air Mobility (AAM) operations at Keystone Heights Airport (42J). Built with React and Vite.

The dashboard presents the results of a 90-day Monte Carlo simulation across 9 infrastructure-traffic scenarios, and provides analysis across safety gates, power requirements, route demand, and phased deployment planning.

---

## Access & Authentication

The demo is now protected by login. Everyone should have received an invite email from Supabase with a link to set their own credentials — use that to log in with your personal account.

If you haven't set up your credentials yet or need immediate access, use the shared team account below:

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@fastflyrr.com`  |
| Password | `admin@123`            |

> Contact [yashasvi.jj@gmail.com](mailto:yashasvi.jj@gmail.com) if you need your individual account set up or reset.

---

## What's Inside

- **9-Scenario Results Matrix** — click any cell to see why it passed, failed, or was flagged as optimal
- **Gate Assessment** — FAA safety and power readiness pass/fail checks
- **Recommended Configuration** — optimal Vertiport build-out spec for 42J
- **Phased Deployment Roadmap** — 36-month implementation plan with CAPEX estimates
- **eVTOL Route Demand Analysis** — 6 destination corridors modeled within 50-mile range
- **Grant Planning Tool** — interactive traffic tier toggle with Chart.js visualizations and grant justification copy

---

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Chart.js 4](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository

   ```bash
   git clone <your-repo-url>
   cd aam-readiness-demo
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the development server

   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`

---

## Available Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start local development server with hot reload  |
| `npm run build`   | Build optimised production output to `dist/`    |
| `npm run preview` | Preview the production build locally            |

---

## Project Structure

```text
aam-readiness-demo/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   ├── scenarios.js      # Simulation results for all 9 scenarios
    │   └── tiers.js          # Low / medium / high traffic tier definitions
    └── components/
        ├── Header.jsx
        ├── Hero.jsx
        ├── StatsBar.jsx
        ├── ScenarioMatrix.jsx
        ├── RecommendedConfig.jsx
        ├── GateAssessment.jsx
        ├── PhasedRoadmap.jsx
        ├── RouteDemand.jsx
        ├── ResourceScaling.jsx
        ├── StrategicCards.jsx
        └── Footer.jsx
```

---

## Data

All simulation results are currently hardcoded in `src/data/`. The values are derived from:

- 50,236 actual operations at 42J (May 2024 – March 2026)
- 90-day Monte Carlo simulation across 9 infrastructure-traffic scenarios
- Demand modeling for 6 population centres within a 50-mile range envelope

> This assessment is for preliminary planning purposes and does not constitute an FAA-approved engineering study. Infrastructure recommendations should be validated by a licensed FAA DER before use in ALP submissions or grant applications.
