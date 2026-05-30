// LandingPage.jsx
// Marketing / product page shown before the demo dashboard.
// Describes the six-step AAM readiness pipeline.
// Props:
//   onEnter {() => void}  called when the user clicks the primary CTA

const STEPS = [
  {
    num: '01',
    color: '#6366f1',
    bg: '#ede9fe',
    title: 'Upload operational data',
    body: 'Import an Airport Operations CSV export alongside basic airport identifiers — ICAO code, county, utility provider. No manual data entry required.',
    tag: 'Data Ingestion',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    num: '02',
    color: '#0ea5e9',
    bg: '#e0f2fe',
    title: 'Analyze the operational baseline',
    body: 'Decompose 22+ months of Airport Operations records into aircraft-category mix, helicopter operations, hour-of-day patterns, and seasonal baselines.',
    tag: 'Pattern Analysis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    num: '03',
    color: '#0d9488',
    bg: '#ccfbf1',
    title: 'Build the eVTOL demand network',
    body: 'Identify population hotspots, employment anchors, and congested corridors within a 50-mile range using a multinomial logit mode-choice model.',
    tag: 'Demand Modelling',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    num: '04',
    color: '#7c3aed',
    bg: '#f5f3ff',
    title: 'Run a 90-day discrete-event simulation',
    body: 'Execute up to 500 Monte Carlo runs per scenario across a 3 × 3 matrix of infrastructure tiers (Vertistop / Vertiport / Vertihub) and traffic levels.',
    tag: 'SimPy Simulation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    num: '05',
    color: '#d97706',
    bg: '#fef3c7',
    title: 'Score through FAA-aligned gate checks',
    body: 'Each scenario is evaluated against a hierarchical two-gate framework — Gate 1 (Safety & Regulatory) and Gate 2 (Power & Grid Resiliency) — mapped to FAA EB-105, AC 150/5210-6D, and 14 CFR Part 139.',
    tag: 'Gate Scoring',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    num: '06',
    color: '#059669',
    bg: '#d1fae5',
    title: 'Generate a professional PDF report',
    body: 'Produce a fully-documented readiness assessment — from a 4-page Preliminary brief to a 55-page Premium report with NPV analysis, regulatory Gantt, and a ready-to-submit grant language pack.',
    tag: 'Report Generation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

const BUCKETS = [
  {
    name: 'Throughput',
    weight: '41%',
    color: '#6366f1',
    bg: '#ede9fe',
    desc: 'How efficiently aircraft move through the facility. Monte Carlo simulation across 500 runs, 90-day window.',
    penalties: [
      { label: 'No weather radar (AWOS only)', pts: '-5' },
      { label: 'No hardened hangars', pts: '-5' },
    ],
    bonuses: [
      { label: 'High-voltage transmission (>69kV within 0.5mi)', pts: '+6' },
      { label: 'Icing & de-icing infrastructure', pts: '+6' },
      { label: 'Severe convective defense', pts: '+5' },
      { label: 'Thermal resilience (warm/convective climate)', pts: '+4' },
    ],
  },
  {
    name: 'Airspace',
    weight: '34%',
    color: '#0ea5e9',
    bg: '#e0f2fe',
    desc: 'Complexity of surrounding airspace. Starts at 100, deducted for ATC friction and peak conflict density.',
    penalties: [
      { label: 'Class B airspace', pts: '-30' },
      { label: 'Class C airspace', pts: '-20' },
      { label: 'Class D airspace', pts: '-12' },
    ],
    bonuses: [
      { label: 'Class G airspace', pts: '+5' },
      { label: 'Touch-and-go complexity', pts: '+5' },
      { label: 'NextGen IFR / WAAS approaches', pts: '+6' },
      { label: 'VTOL pad proximity', pts: '+3' },
      { label: 'Aviation electrification on-field', pts: '+5' },
    ],
  },
  {
    name: 'Demand',
    weight: '25%',
    color: '#0d9488',
    bg: '#ccfbf1',
    desc: 'Market potential for the route. Gravity model using US Census 30-mile catchment and projected annual passengers.',
    penalties: [],
    bonuses: [
      { label: 'Medevac — Level I trauma centre', pts: '+10' },
      { label: 'Opportunity zone in catchment', pts: '+10' },
      { label: 'Middle-mile freight hub within 1mi', pts: '+7' },
      { label: 'Multimodal heavy rail nearby', pts: '+6' },
      { label: 'Medevac — Level II trauma centre', pts: '+5' },
    ],
  },
];

const GATES = [
  { tier: 'Gate 1', label: 'Safety & Regulatory', color: '#6366f1', bg: '#ede9fe', items: ['EB-105 ramp geometry', 'ARFF capability (Index A/B)', 'Medevac within 20 miles', 'System resiliency ≥ 95%'] },
  { tier: 'Gate 2', label: 'Power & Grid Resiliency', color: '#0ea5e9', bg: '#e0f2fe', items: ['Microgrid installed (solar + BESS)', 'Grid capacity headroom', 'Thermal management (NFPA 855)'] },
];

const TRUST_ITEMS = [
  { label: 'FAA EB-105', note: 'Vertiport design standard' },
  { label: 'AC 150/5210-6D', note: 'ARFF regulatory basis' },
  { label: '14 CFR Part 139', note: 'Airport certification' },
  { label: 'USDOT RAISE', note: 'Grant alignment' },
  { label: 'Ben-Akiva & Lerman', note: 'Demand model framework' },
];

export default function LandingPage({ onEnter }) {
  return (
    <div className="lp-root">

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="lp-nav">
        <div className="lp-logo">
          <span className="lp-logo-dim">AAM</span>
          <span className="lp-logo-bright"> Readiness System</span>
        </div>
        <div className="lp-nav-right">
          <span className="lp-nav-badge">Beta</span>
          <button className="lp-nav-cta" onClick={onEnter}>
            View Sample Assessment →
          </button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-eyebrow">Advanced Air Mobility · Airport Readiness</div>
          <h1 className="lp-hero-h1">
            Know if your airport is ready<br />
            for the eVTOL era.
          </h1>
          <p className="lp-hero-sub">
            Upload Airport Operations data export. Get a FAA-grade readiness score, a 90-day
            simulation across 9 infrastructure scenarios, and a grant-ready PDF report —
            in minutes.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" onClick={onEnter}>
              View a live assessment demo
            </button>
            <a className="lp-btn-ghost" href="#how-it-works">
              How it works ↓
            </a>
          </div>

          {/* Score preview pill */}
          <div className="lp-hero-preview">
            <div className="lp-preview-score">
              <div className="lp-preview-ring">
                <svg viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
                  <circle cx="32" cy="32" r="27" fill="none" stroke="#22c55e" strokeWidth="5"
                    strokeLinecap="round" strokeDasharray="169.6" strokeDashoffset="12"
                    transform="rotate(-90 32 32)" />
                </svg>
                <span className="lp-preview-num">98</span>
              </div>
              <div>
                <div className="lp-preview-label">Readiness Index</div>
                <div className="lp-preview-sublabel">Tampa International Airport · TPA · OPTIMAL</div>
              </div>
            </div>
            <div className="lp-preview-pills">
              <div className="lp-preview-pill lp-pill-green">Gate 1 PASS*</div>
              <div className="lp-preview-pill lp-pill-amber">Gate 2 PASS*</div>
              <div className="lp-preview-pill lp-pill-blue">9 / 9 scenarios ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pipeline ─────────────────────────────────────── */}
      <section className="lp-pipeline" id="how-it-works">
        <div className="lp-section-inner">
          <div className="lp-section-eyebrow">The pipeline</div>
          <h2 className="lp-section-h2">Six steps from raw data to grant-ready report</h2>
          <p className="lp-section-sub">
            Every assessment runs the same reproducible pipeline — no black boxes,
            every data source cited, every assumption documented.
          </p>

          <div className="lp-steps">
            {STEPS.map((step, i) => (
              <div className="lp-step" key={i}>
                {/* connector line between steps */}
                {i < STEPS.length - 1 && i !== 2 && (
                  <div className="lp-step-connector" />
                )}
                <div className="lp-step-card">
                  <div className="lp-step-header">
                    <div className="lp-step-icon" style={{ color: step.color, background: step.bg }}>
                      {step.icon}
                    </div>
                    <div className="lp-step-num" style={{ color: step.color }}>
                      {step.num}
                    </div>
                  </div>
                  <div className="lp-step-tag" style={{ color: step.color, background: step.bg }}>
                    {step.tag}
                  </div>
                  <h3 className="lp-step-title">{step.title}</h3>
                  <p className="lp-step-body">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scoring Engine ───────────────────────────────── */}
      <section className="lp-scoring" id="scoring">
        <div className="lp-section-inner">
          <div className="lp-section-eyebrow">Scoring Engine</div>
          <h2 className="lp-section-h2">How your readiness score is calculated</h2>
          <p className="lp-section-sub">
            Every airport runs through the same transparent, research-backed pipeline —
            gates first, then simulation-derived base scores, adjusted by penalties and bonuses,
            capped at +15 bonus per bucket, then combined via AHP-weighted final score.
          </p>

          {/* Scoring flow */}
          <div className="lp-score-flow">
            {[
              { step: '01', label: 'Gate checks', note: 'Hard blockers — fail either gate and no score is generated', color: '#6366f1' },
              { step: '02', label: 'Base score', note: 'Simulation-derived starting point per bucket', color: '#6366f1' },
              { step: '03', label: 'Penalties', note: 'Deducted for missing infrastructure or complex airspace', color: '#ef4444' },
              { step: '04', label: 'Bonuses', note: 'Added for strengths, capped at +15 per bucket', color: '#16a34a' },
              { step: '05', label: 'AHP weight', note: 'Bucket scores multiplied by expert-elicited weights', color: '#6366f1' },
              { step: '06', label: 'Final index', note: 'Sum of weighted buckets, hard-capped at 100', color: '#6366f1' },
            ].map((f, i, arr) => (
              <div className="lp-flow-item" key={i}>
                <div className="lp-flow-dot" style={{ background: f.color }} />
                {i < arr.length - 1 && <div className="lp-flow-line" />}
                <div className="lp-flow-step" style={{ color: f.color }}>{f.step}</div>
                <div className="lp-flow-label">{f.label}</div>
                <div className="lp-flow-note">{f.note}</div>
              </div>
            ))}
          </div>

          {/* Gate checks */}
          <h3 className="lp-scoring-subhead">Gate checks — hard blockers</h3>
          <p className="lp-scoring-subdesc">Both gates must pass before any bucket score is generated. A single failure blocks the entire assessment.</p>
          <div className="lp-gates">
            {GATES.map((g, i) => (
              <div className="lp-gate-card" key={i} style={{ borderTopColor: g.color, borderTopWidth: 3 }}>
                <div className="lp-gate-header">
                  <span className="lp-gate-tier" style={{ color: g.color, background: g.bg }}>{g.tier}</span>
                  <span className="lp-gate-label">{g.label}</span>
                </div>
                <ul className="lp-gate-list">
                  {g.items.map((item, j) => (
                    <li key={j}>
                      <svg viewBox="0 0 24 24" fill="none" stroke={g.color} strokeWidth="2.5" strokeLinecap="round" width="12" height="12" style={{ flexShrink: 0, marginTop: 2 }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bucket breakdown */}
          <h3 className="lp-scoring-subhead" style={{ marginTop: 56 }}>The three scoring buckets</h3>
          <p className="lp-scoring-subdesc">Each bucket is scored independently then multiplied by its AHP weight to produce the final readiness index.</p>
          <div className="lp-buckets">
            {BUCKETS.map((b, i) => (
              <div className="lp-bucket-card" key={i} style={{ borderTopColor: b.color, borderTopWidth: 3 }}>
                <div className="lp-bucket-header">
                  <div className="lp-bucket-name">{b.name}</div>
                  <div className="lp-bucket-weight" style={{ color: b.color, background: b.bg }}>{b.weight}</div>
                </div>
                <div className="lp-bucket-desc">{b.desc}</div>

                {b.penalties.length > 0 && (
                  <div className="lp-bucket-section">
                    <div className="lp-bucket-section-label lp-label-penalty">Penalties</div>
                    {b.penalties.map((p, j) => (
                      <div className="lp-adj-row" key={j}>
                        <span className="lp-adj-label">{p.label}</span>
                        <span className="lp-adj-pts lp-pts-neg">{p.pts}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="lp-bucket-section">
                  <div className="lp-bucket-section-label lp-label-bonus">Bonuses (max +15)</div>
                  {b.bonuses.map((bon, j) => (
                    <div className="lp-adj-row" key={j}>
                      <span className="lp-adj-label">{bon.label}</span>
                      <span className="lp-adj-pts lp-pts-pos">{bon.pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lp-scoring-footer">
            <span>Bonus ceiling: max <strong>+15 per bucket</strong> before reaching base score</span>
            <span>·</span>
            <span>Hard cap: <strong>100</strong> per bucket</span>
            <span>·</span>
            <span>AHP consistency ratio: <strong>CR = 0.06</strong> (Oct 2025 expert elicitation)</span>
            <span>·</span>
            <span className="lp-scoring-disclaimer">PRELIMINARY — Not a substitute for FAA-approved engineering review</span>
          </div>
        </div>
      </section>

      {/* ── Regulatory trust bar ──────────────────────────── */}
      <section className="lp-trust">
        <div className="lp-trust-inner">
          <span className="lp-trust-label">Aligned with</span>
          {TRUST_ITEMS.map((t, i) => (
            <div className="lp-trust-item" key={i}>
              <span className="lp-trust-name">{t.label}</span>
              <span className="lp-trust-note">{t.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Output tiers ─────────────────────────────────── */}
      <section className="lp-tiers">
        <div className="lp-section-inner">
          <div className="lp-section-eyebrow">Report tiers</div>
          <h2 className="lp-section-h2">From quick screen to full grant package</h2>

          <div className="lp-tier-cards">
            <div className="lp-tier-card">
              <div className="lp-tier-badge lp-tier-prelim">Preliminary</div>
              <div className="lp-tier-pages">~4 pages</div>
              <h3 className="lp-tier-title">Executive Screen</h3>
              <p className="lp-tier-desc">
                Readiness score, gate summary, and top recommendation. Designed to
                inform a go/no-go decision in minutes.
              </p>
              <ul className="lp-tier-list">
                <li>Overall readiness index</li>
                <li>Gate 1 + Gate 2 verdict</li>
                <li>Optimal configuration</li>
                <li>Key data sources</li>
              </ul>
            </div>

            <div className="lp-tier-card lp-tier-card-featured">
              <div className="lp-tier-badge lp-tier-std">Standard</div>
              <div className="lp-tier-pages">~24 pages</div>
              <h3 className="lp-tier-title">Full Assessment</h3>
              <p className="lp-tier-desc">
                Complete site profile, demand analysis, simulation results, gate
                checks, CAPEX breakdown, and federal funding pathways.
              </p>
              <ul className="lp-tier-list">
                <li>9-scenario simulation matrix</li>
                <li>Route demand & mode shift</li>
                <li>CAPEX breakdown ($4–5M)</li>
                <li>3 federal funding programs</li>
                <li>Regulatory action plan</li>
              </ul>
            </div>

            <div className="lp-tier-card">
              <div className="lp-tier-badge lp-tier-prem">Premium</div>
              <div className="lp-tier-pages">~55 pages</div>
              <h3 className="lp-tier-title">Grant Package</h3>
              <p className="lp-tier-desc">
                Everything in Standard plus NPV analysis, regulatory Gantt,
                DER validation scope, and a pre-drafted grant language pack.
              </p>
              <ul className="lp-tier-list">
                <li>NPV + B/C ratio (USDOT RAISE ready)</li>
                <li>Regulatory timeline Gantt</li>
                <li>Per-corridor demand analysis</li>
                <li>Calculation logic callouts</li>
                <li>Appendix D: Grant language pack</li>
                <li>Appendix E: Full data source audit</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="lp-cta">
        <div className="lp-cta-inner">
          <h2 className="lp-cta-h2">See a real assessment in action.</h2>
          <p className="lp-cta-sub">
            Explore the Airport Demo — all charts, all gate checks,
            all three report tiers, live in your browser.
          </p>
          <button className="lp-btn-primary lp-btn-lg" onClick={onEnter}>
            Open the demo dashboard →
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="lp-footer">
        <span className="lp-logo-dim">AAM</span>
        <span className="lp-logo-bright"> Readiness System</span>
        <span className="lp-footer-sep">·</span>
        <span className="lp-footer-note">Demo - April 2026</span>
      </footer>
    </div>
  );
}
