// ScoreSimulator.jsx
// Interactive score simulator — lets users toggle infrastructure items
// and see how the readiness index changes in real time.
// Scoring rules mirror the FastFlyrr Readiness Engine v2026.3.

import { useState } from 'react';

const AIRSPACE_CLASSES = [
  { value: 'G', label: 'Class G', pts:   5, note: 'Uncontrolled — simplest USS integration' },
  { value: 'D', label: 'Class D', pts: -12, note: 'Tower-controlled' },
  { value: 'C', label: 'Class C', pts: -20, note: 'Radar-controlled' },
  { value: 'B', label: 'Class B', pts: -30, note: 'Major terminal — highest ATC burden' },
];

const INITIAL = {
  gate1: true,
  gate2: true,
  throughput: {
    base: 72,
    penalties: [
      { id: 'no_radar',   label: 'No weather radar (AWOS only)',  pts: -5, active: false },
      { id: 'no_hangars', label: 'No hardened hangars',            pts: -5, active: false },
    ],
    bonuses: [
      { id: 'hv_tx',      label: 'High-voltage transmission >69kV within 0.5mi', pts: 6, active: false },
      { id: 'de_icing',   label: 'Icing & de-icing infrastructure',               pts: 6, active: false },
      { id: 'convective', label: 'Severe convective defense',                      pts: 5, active: false },
      { id: 'thermal',    label: 'Thermal resilience (warm/convective climate)',   pts: 4, active: false },
    ],
  },
  airspace: {
    class: 'G',
    bonuses: [
      { id: 'waas',     label: 'NextGen IFR / WAAS approaches',    pts: 6, active: false },
      { id: 'touch_go', label: 'Touch-and-go complexity >20%',     pts: 5, active: false },
      { id: 'av_elec',  label: 'Aviation electrification on-field', pts: 5, active: false },
      { id: 'vtol_pad', label: 'VTOL pad proximity on-field',       pts: 3, active: false },
    ],
  },
  demand: {
    base: 65,
    bonuses: [
      { id: 'medevac1', label: 'Medevac — Level I trauma centre',       pts: 10, active: false },
      { id: 'opzone',   label: 'Opportunity zone in catchment',         pts: 10, active: false },
      { id: 'freight',  label: 'Middle-mile freight hub within 1mi',    pts:  7, active: false },
      { id: 'rail',     label: 'Multimodal heavy rail nearby',          pts:  6, active: false },
      { id: 'medevac2', label: 'Medevac — Level II trauma centre',      pts:  5, active: false },
    ],
  },
};

function calcScores(s) {
  if (!s.gate1 || !s.gate2) {
    return { t: 0, a: 0, d: 0, final: 0, blocked: true };
  }

  // Throughput
  const tPen   = s.throughput.penalties.filter(p => p.active).reduce((acc, p) => acc + p.pts, 0);
  const tBonus = Math.min(15, s.throughput.bonuses.filter(b => b.active).reduce((acc, b) => acc + b.pts, 0));
  const t      = Math.min(100, Math.max(0, s.throughput.base + tPen + tBonus));

  // Airspace — base 100, airspace class modifier, then bonuses
  const cls    = AIRSPACE_CLASSES.find(c => c.value === s.airspace.class);
  const aBase  = 100 + (cls?.pts ?? 0);
  const aBonus = Math.min(15, s.airspace.bonuses.filter(b => b.active).reduce((acc, b) => acc + b.pts, 0));
  const a      = Math.min(100, Math.max(0, aBase + aBonus));

  // Demand
  const dBonus = Math.min(15, s.demand.bonuses.filter(b => b.active).reduce((acc, b) => acc + b.pts, 0));
  const d      = Math.min(100, Math.max(0, s.demand.base + dBonus));

  const final = Math.round(t * 0.41 + a * 0.34 + d * 0.25);
  return { t: Math.round(t), a: Math.round(a), d: Math.round(d), final, blocked: false };
}

function scoreColor(n, blocked) {
  if (blocked || n < 50) return '#ef4444';
  if (n < 70) return '#f59e0b';
  if (n < 85) return '#3b82f6';
  return '#22c55e';
}

function scoreLabel(n, blocked) {
  if (blocked) return 'BLOCKED';
  if (n < 50)  return 'NOT READY';
  if (n < 70)  return 'DEVELOPING';
  if (n < 85)  return 'CAPABLE';
  return 'OPTIMAL';
}

// Toggle a penalty/bonus by id within a bucket array key
function toggleItem(state, bucket, arrayKey, id) {
  return {
    ...state,
    [bucket]: {
      ...state[bucket],
      [arrayKey]: state[bucket][arrayKey].map(item =>
        item.id === id ? { ...item, active: !item.active } : item
      ),
    },
  };
}

function GateToggle({ label, sublabel, active, onChange }) {
  return (
    <button
      type="button"
      className={`sim-gate-btn${active ? ' sim-gate-active' : ' sim-gate-fail'}`}
      onClick={() => onChange(!active)}
    >
      <span className={`sim-gate-dot${active ? ' sim-gate-dot-pass' : ' sim-gate-dot-fail'}`} />
      <span className="sim-gate-text">
        <span className="sim-gate-name">{label}</span>
        <span className="sim-gate-sub">{active ? 'PASS' : 'FAIL — blocks all scoring'}</span>
      </span>
      <span className="sim-gate-sublabel">{sublabel}</span>
    </button>
  );
}

function AdjRow({ label, pts, active, onChange }) {
  const isBonus = pts > 0;
  return (
    <label className={`sim-adj-row${active ? ' sim-adj-active' : ''}`}>
      <input type="checkbox" checked={active} onChange={onChange} className="sim-checkbox" />
      <span className="sim-adj-label">{label}</span>
      <span className={`sim-adj-pts ${isBonus ? 'sim-pts-pos' : 'sim-pts-neg'}`}>
        {isBonus ? `+${pts}` : pts}
      </span>
    </label>
  );
}

function BucketPanel({ title, weight, color, score, blocked, children }) {
  const col = blocked ? '#94a3b8' : color;
  return (
    <div className="sim-bucket">
      <div className="sim-bucket-header">
        <div>
          <div className="sim-bucket-name" style={{ color: col }}>{title}</div>
          <div className="sim-bucket-weight">AHP weight {weight}</div>
        </div>
        <div className="sim-bucket-score" style={{ color: col }}>
          {score}<span className="sim-bucket-denom">/100</span>
        </div>
      </div>
      <div className="sim-bucket-body">{children}</div>
    </div>
  );
}

export default function ScoreSimulator() {
  const [state, setState] = useState(INITIAL);
  const scores = calcScores(state);
  const color  = scoreColor(scores.final, scores.blocked);

  function setBase(bucket, value) {
    setState(s => ({ ...s, [bucket]: { ...s[bucket], base: Number(value) } }));
  }

  function setAirspaceClass(value) {
    setState(s => ({ ...s, airspace: { ...s.airspace, class: value } }));
  }

  function toggle(bucket, arrayKey, id) {
    setState(s => toggleItem(s, bucket, arrayKey, id));
  }

  function reset() { setState(INITIAL); }

  // Airspace class contribution to score
  const cls = AIRSPACE_CLASSES.find(c => c.value === state.airspace.class);

  return (
    <div className="card sim-root">
      <div className="section-label">What-if Analysis</div>
      <div className="sim-top-row">
        <div>
          <h2>Score Simulator</h2>
          <div className="sub">Toggle infrastructure items to see how the readiness index changes in real time.</div>
        </div>
        <button type="button" className="sim-reset-btn" onClick={reset}>Reset</button>
      </div>

      {/* ── Gates ─────────────────────────────── */}
      <div className="sim-gates">
        <GateToggle
          label="Gate 1"
          sublabel="Safety & Regulatory"
          active={state.gate1}
          onChange={v => setState(s => ({ ...s, gate1: v }))}
        />
        <GateToggle
          label="Gate 2"
          sublabel="Power & Grid Resiliency"
          active={state.gate2}
          onChange={v => setState(s => ({ ...s, gate2: v }))}
        />
      </div>

      {/* ── Final score ───────────────────────── */}
      <div className="sim-final-row">
        <div className="sim-final-ring" style={{ '--ring-color': color }}>
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50"
              fill="none" stroke={color} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - scores.final / 100)}`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.4s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div className="sim-final-center">
            <div className="sim-final-num" style={{ color }}>{scores.final}</div>
            <div className="sim-final-denom">/100</div>
          </div>
        </div>
        <div className="sim-final-breakdown">
          <div className="sim-final-label" style={{ color }}>{scoreLabel(scores.final, scores.blocked)}</div>
          <div className="sim-breakdown-rows">
            {[
              { name: 'Throughput', score: scores.t, weight: '× 0.41', contrib: Math.round(scores.t * 0.41), color: '#6366f1' },
              { name: 'Airspace',   score: scores.a, weight: '× 0.34', contrib: Math.round(scores.a * 0.34), color: '#0ea5e9' },
              { name: 'Demand',     score: scores.d, weight: '× 0.25', contrib: Math.round(scores.d * 0.25), color: '#0d9488' },
            ].map(r => (
              <div className="sim-breakdown-row" key={r.name}>
                <span className="sim-bd-name" style={{ color: r.color }}>{r.name}</span>
                <div className="sim-bd-bar-wrap">
                  <div
                    className="sim-bd-bar"
                    style={{ width: `${r.score}%`, background: r.color, transition: 'width 0.4s ease' }}
                  />
                </div>
                <span className="sim-bd-score">{r.score}</span>
                <span className="sim-bd-weight">{r.weight}</span>
                <span className="sim-bd-contrib" style={{ color: r.color }}>= {r.contrib}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bucket panels ─────────────────────── */}
      <div className="sim-buckets">

        {/* Throughput */}
        <BucketPanel title="Throughput" weight="41%" color="#6366f1" score={scores.t} blocked={scores.blocked}>
          <div className="sim-base-row">
            <label className="sim-base-label">Base score</label>
            <input
              type="range" min="0" max="100"
              value={state.throughput.base}
              onChange={e => setBase('throughput', e.target.value)}
              className="sim-slider"
              style={{ '--thumb-color': '#6366f1' }}
            />
            <span className="sim-base-val">{state.throughput.base}</span>
          </div>
          <div className="sim-group-label sim-label-pen">Penalties</div>
          {state.throughput.penalties.map(p => (
            <AdjRow key={p.id} label={p.label} pts={p.pts} active={p.active}
              onChange={() => toggle('throughput', 'penalties', p.id)} />
          ))}
          <div className="sim-group-label sim-label-bon">Bonuses (ceiling +15)</div>
          {state.throughput.bonuses.map(b => (
            <AdjRow key={b.id} label={b.label} pts={b.pts} active={b.active}
              onChange={() => toggle('throughput', 'bonuses', b.id)} />
          ))}
        </BucketPanel>

        {/* Airspace */}
        <BucketPanel title="Airspace" weight="34%" color="#0ea5e9" score={scores.a} blocked={scores.blocked}>
          <div className="sim-base-row">
            <label className="sim-base-label">Airspace class</label>
          </div>
          <div className="sim-airspace-grid">
            {AIRSPACE_CLASSES.map(c => (
              <label
                key={c.value}
                className={`sim-airspace-opt${state.airspace.class === c.value ? ' sim-airspace-selected' : ''}`}
              >
                <input
                  type="radio"
                  name="airspace"
                  value={c.value}
                  checked={state.airspace.class === c.value}
                  onChange={() => setAirspaceClass(c.value)}
                  className="sim-radio"
                />
                <span className="sim-airspace-class">{c.label}</span>
                <span className={`sim-airspace-pts ${c.pts > 0 ? 'sim-pts-pos' : c.pts < 0 ? 'sim-pts-neg' : ''}`}>
                  {c.pts > 0 ? `+${c.pts}` : c.pts}
                </span>
                <span className="sim-airspace-note">{c.note}</span>
              </label>
            ))}
          </div>
          <div className="sim-group-label sim-label-bon" style={{ marginTop: 16 }}>Bonuses (ceiling +15)</div>
          {state.airspace.bonuses.map(b => (
            <AdjRow key={b.id} label={b.label} pts={b.pts} active={b.active}
              onChange={() => toggle('airspace', 'bonuses', b.id)} />
          ))}
        </BucketPanel>

        {/* Demand */}
        <BucketPanel title="Demand" weight="25%" color="#0d9488" score={scores.d} blocked={scores.blocked}>
          <div className="sim-base-row">
            <label className="sim-base-label">Base score</label>
            <input
              type="range" min="0" max="100"
              value={state.demand.base}
              onChange={e => setBase('demand', e.target.value)}
              className="sim-slider"
              style={{ '--thumb-color': '#0d9488' }}
            />
            <span className="sim-base-val">{state.demand.base}</span>
          </div>
          <div className="sim-group-label sim-label-bon">Bonuses (ceiling +15)</div>
          {state.demand.bonuses.map(b => (
            <AdjRow key={b.id} label={b.label} pts={b.pts} active={b.active}
              onChange={() => toggle('demand', 'bonuses', b.id)} />
          ))}
        </BucketPanel>

      </div>
    </div>
  );
}
