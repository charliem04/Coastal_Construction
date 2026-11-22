"use client";

import { useState } from "react";
import type { ChecklistGroup } from "@/content/landChecklist";

/** Ticks live only in this page view: nothing is stored or sent. */
export function LandChecklist({ groups }: { groups: ChecklistGroup[] }) {
  const [done, setDone] = useState<Set<string>>(new Set());
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const toggle = (item: string) =>
    setDone((current) => {
      const next = new Set(current);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });

  return (
    <div className="land-checklist">
      <div className="checklist-progress">
        <p aria-live="polite">
          {done.size} of {total} checked
        </p>
        <div aria-hidden="true">
          <i style={{ transform: `scaleX(${done.size / total})` }} />
        </div>
        <button type="button" onClick={() => setDone(new Set())} disabled={done.size === 0}>
          Reset
        </button>
      </div>
      <div className="checklist-groups">
        {groups.map((group) => (
          <section key={group.title}>
            <h3>{group.title}</h3>
            <p>{group.why}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  <label>
                    <input type="checkbox" checked={done.has(item)} onChange={() => toggle(item)} />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
