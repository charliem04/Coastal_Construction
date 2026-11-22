"use client";

import { useMemo, useState } from "react";
import { calculatorAssumptions, type CalculatorField, type CalculatorKind } from "@/content/calculators";
import { fillYards, padYards, pondVolume, withAssumptions } from "@/lib/calculators";

const whole = (n: number) => Math.round(n).toLocaleString("en-US");

function compute(kind: CalculatorKind, v: Record<string, number>) {
  if (kind === "fill") return { yards: fillYards(v.length, v.width, v.depth), extra: [] as string[] };
  if (kind === "pad") return { yards: padYards(v.length, v.width, v.height, v.slope), extra: [] as string[] };
  const pond = pondVolume(v.length, v.width, v.depth, v.slope);
  if (!pond) return null;
  return { yards: pond.yards, extra: [`${pond.acres.toFixed(2)} surface acres`, `${whole(pond.gallons)} gallons when full`] };
}

export function VolumeCalculator({ kind, fields, resultLabel }: { kind: CalculatorKind; fields: CalculatorField[]; resultLabel: string }) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map((f) => [f.id, String(f.value)])));

  const result = useMemo(() => {
    const parsed = Object.fromEntries(fields.map((f) => [f.id, Number(values[f.id])]));
    const valid = fields.every((f) => values[f.id] !== "" && Number.isFinite(parsed[f.id]) && parsed[f.id] > 0);
    return valid ? compute(kind, parsed) : null;
  }, [fields, kind, values]);
  const owner = result ? withAssumptions(result.yards, calculatorAssumptions.truckYards, calculatorAssumptions.compactionPercent) : null;

  return (
    <div className="calc-tool">
      <form onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => (
          <label key={field.id}>
            <span>{field.label}</span>
            <div>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={field.step}
                value={values[field.id]}
                onChange={(e) => setValues((current) => ({ ...current, [field.id]: e.target.value }))}
              />
              <small>{field.unit}</small>
            </div>
          </label>
        ))}
      </form>
      <output className="calc-result" aria-live="polite">
        <span>{resultLabel}</span>
        {result ? (
          <>
            <strong>{whole(result.yards)} yd&sup3;</strong>
            {result.extra.map((line) => (
              <small key={line}>{line}</small>
            ))}
            {owner?.planned != null && <small>About {whole(owner.planned)} yd&sup3; with allowance</small>}
            {owner?.trucks != null && <small>About {owner.trucks} truckloads</small>}
          </>
        ) : (
          <em>{kind === "pond" ? "Enter positive sizes. The basin must be wide enough for this depth and slope." : "Enter positive numbers."}</em>
        )}
      </output>
    </div>
  );
}
