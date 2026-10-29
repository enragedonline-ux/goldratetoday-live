"use client";

import { useMemo, useState } from "react";
import { inr, type Purity } from "@/lib/rates";

const TOLA_GRAMS = 11.6638;

const CARATS = [
  { carat: "24K", fineness: "999" },
  { carat: "22K", fineness: "916" },
  { carat: "18K", fineness: "750" },
  { carat: "14K", fineness: "585" },
];

const UNITS = [
  { key: "grams", label: "Grams", toGrams: 1 },
  { key: "tolas", label: "Tolas", toGrams: TOLA_GRAMS },
  { key: "kilograms", label: "Kilograms", toGrams: 1000 },
] as const;

type UnitKey = (typeof UNITS)[number]["key"];

const PRESETS: Array<{ label: string; weight: number; unit: UnitKey }> = [
  { label: "1 g", weight: 1, unit: "grams" },
  { label: "8 g", weight: 8, unit: "grams" },
  { label: "10 g", weight: 10, unit: "grams" },
  { label: "1 tola", weight: 1, unit: "tolas" },
];

export default function GoldCalculator({
  rates,
  live,
  updatedLabel,
}: {
  rates: Purity[];
  live: boolean;
  updatedLabel: string;
}) {
  const [carat, setCarat] = useState("22K");
  const [unit, setUnit] = useState<UnitKey>("grams");
  const [weight, setWeight] = useState(10);
  const [makingPct, setMakingPct] = useState(10);

  const rate = rates.find((r) => r.carat === carat) ?? rates[0];
  const unitDef = UNITS.find((u) => u.key === unit) ?? UNITS[0];

  const calc = useMemo(() => {
    const grams = (Number.isFinite(weight) ? weight : 0) * unitDef.toGrams;
    const metal = Math.round(grams * rate.perGram);
    const making = Math.round((metal * makingPct) / 100);
    const subtotal = metal + making;
    const gst = Math.round((subtotal * 3) / 100);
    const total = subtotal + gst;
    return { grams, metal, making, gst, total };
  }, [weight, unitDef, rate, makingPct]);

  const fineness =
    CARATS.find((c) => c.carat === carat)?.fineness ?? "";

  return (
    <div className="calc">
      <p className="calc-live">
        {live
          ? `Live rate, updated ${updatedLabel}.`
          : "Sample rates shown, live feed unavailable."}{" "}
        {rate.carat} {inr(rate.perGram)} per gram, {inr(rate.per10Gram)} per
        10 gram.
      </p>

      <div className="calc-field">
        <span className="calc-label">Purity</span>
        <div className="calc-pills" role="group" aria-label="Gold purity">
          {CARATS.map((c) => (
            <button
              key={c.carat}
              type="button"
              className={carat === c.carat ? "calc-pill on" : "calc-pill"}
              aria-pressed={carat === c.carat}
              onClick={() => setCarat(c.carat)}
            >
              {c.carat} <small>{c.fineness}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="calc-field">
        <span className="calc-label">Unit</span>
        <div className="calc-pills" role="group" aria-label="Weight unit">
          {UNITS.map((u) => (
            <button
              key={u.key}
              type="button"
              className={unit === u.key ? "calc-pill on" : "calc-pill"}
              aria-pressed={unit === u.key}
              onClick={() => setUnit(u.key)}
            >
              {u.label}
            </button>
          ))}
        </div>
      </div>

      <div className="calc-field">
        <label className="calc-label" htmlFor="calc-weight">
          Weight
        </label>
        <div className="calc-weight-row">
          <input
            id="calc-weight"
            className="calc-input"
            type="number"
            min="0"
            step="any"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          />
          <span className="calc-unit">{unitDef.label}</span>
        </div>
        <div className="calc-presets">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              className="calc-preset"
              onClick={() => {
                setWeight(p.weight);
                setUnit(p.unit);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="calc-field">
        <label className="calc-label" htmlFor="calc-making">
          Making charge: {makingPct}%
        </label>
        <input
          id="calc-making"
          className="calc-slider"
          type="range"
          min="0"
          max="25"
          step="1"
          value={makingPct}
          onChange={(e) => setMakingPct(parseInt(e.target.value, 10))}
        />
        <div className="calc-slider-marks">
          <span>0%</span>
          <span>25%</span>
        </div>
      </div>

      <div className="calc-results" aria-live="polite">
        <div>
          <span>Metal cost</span>
          <strong>{inr(calc.metal)}</strong>
        </div>
        <div>
          <span>Making charge ({makingPct}%)</span>
          <strong>{inr(calc.making)}</strong>
        </div>
        <div>
          <span>GST (3%)</span>
          <strong>{inr(calc.gst)}</strong>
        </div>
        <div className="calc-total">
          <span>Total payable</span>
          <strong>{inr(calc.total)}</strong>
        </div>
      </div>

      <p className="calc-breakdown">
        {calc.grams.toLocaleString("en-IN", { maximumFractionDigits: 2 })}{" "}
        grams of {rate.carat} ({fineness} fine) at {inr(rate.perGram)} per
        gram. GST is charged at 3% on metal plus making charge. Rates are
        the international spot benchmark converted to INR, before import
        duty and dealer premium, so your jeweller&apos;s final bill may be
        higher.
      </p>
    </div>
  );
}
