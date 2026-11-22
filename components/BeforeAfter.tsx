"use client";

/**
 * Before-and-after photos with a draggable red survey line. A native
 * range input does the dragging and keyboard work, so it is accessible
 * by construction. Renders nothing until real project pairs exist.
 */
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { client } from "@/client.config";
import { projectPairs } from "@/content/projects";
import type { ProjectPair } from "@/content/types";
import { photo } from "@/lib/photo";
import { sliderKey } from "@/lib/slider";
import { Highlight } from "./Highlight";
import { Reveal } from "./Reveal";

const b = client.home.beforeAfter;
const KEYS = new Set(["ArrowLeft", "ArrowRight", "Home", "End"]);

function Pair({ pair }: { pair: ProjectPair }) {
  const [value, setValue] = useState(50);
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!KEYS.has(e.key)) return;
    e.preventDefault();
    setValue((v) => sliderKey(v, e.key));
  };
  return (
    <figure className="before-after">
      <div className="before-after-stage">
        <Image {...photo(pair.after)} alt={pair.afterAlt} sizes="(max-width: 968px) 100vw, 900px" />
        <div className="before-after-top" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
          <Image {...photo(pair.before)} alt={pair.beforeAlt} sizes="(max-width: 968px) 100vw, 900px" />
        </div>
        <span className="before-after-label is-before">{b.before}</span>
        <span className="before-after-label is-after">{b.after}</span>
        <span className="before-after-handle" style={{ left: `${value}%` }} aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label={`${b.sliderLabel}: ${pair.service}, ${pair.location}`}
          onChange={(e) => setValue(Number(e.target.value))}
          onKeyDown={onKeyDown}
        />
      </div>
      <figcaption>
        {pair.service} <span>{pair.location}</span>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter() {
  if (!projectPairs.length) return null;
  return (
    <section className="before-after-section">
      <Reveal>
        <h2 className="section-title">
          <Highlight text={b.title} />
        </h2>
        <p className="section-subtitle">{b.subtitle}</p>
      </Reveal>
      <div className="before-after-list">
        {projectPairs.map((pair) => (
          <Reveal key={`${pair.before}-${pair.after}`}>
            <Pair pair={pair} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
