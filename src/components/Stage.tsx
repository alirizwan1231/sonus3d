"use client";

import React, { useEffect, useRef, useState } from "react";
import Scene3D from "./Scene3D";
import { stage, VARIANTS } from "@/lib/stage";

const VIEWS = [
  { label: "Spin 90°", run: () => { stage.yawTarget += Math.PI / 2; } },
  { label: "Top view", run: () => { stage.pitchTarget = 0.5; } },
  { label: "Low angle", run: () => { stage.pitchTarget = -0.3; } },
  { label: "Reset view", run: () => { stage.yawTarget = 0; stage.pitchTarget = 0; } },
];

export default function Stage({ variant, setVariant }: { variant: number; setVariant: (i: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [act, setAct] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [prog, setProg] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const p = Math.min(1, Math.max(0, -r.top / total));
        stage.progress = p;
        setProg(p);
        setAct(p < 0.3 ? 0 : p < 0.66 ? 1 : 2);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (act !== 1 && exploded) { setExploded(false); stage.explodeTarget = 0; }
  }, [act, exploded]);

  const toggleExplode = () => {
    const next = !exploded;
    setExploded(next);
    stage.explodeTarget = next ? 1 : 0;
  };

  const panel = "transition-all duration-700 ease-out";
  const show = (a: number) => act === a ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none";

  return (
    <div ref={wrapRef} id="stage3d" className="relative" style={{ height: "340vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden stage-bg">
        <div className="absolute inset-0 grid-lines" />
        <Scene3D />

        {/* Act 0 — hero */}
        <div className={`absolute inset-0 pointer-events-none ${panel} ${show(0)}`}>
          <div className="absolute top-24 md:top-28 left-0 right-0 text-center px-5">
            <p className="font-mono text-[11px] md:text-xs tracking-[0.35em] text-accent">SONUS ONE · REAL-TIME 3D</p>
            <h1 className="font-display font-700 leading-[0.92] mt-4 text-[12vw] md:text-[7.5rem] font-bold tracking-tight">
              HEAR<br />EVERY<span className="text-accent">THING.</span>
            </h1>
          </div>
          <div className="absolute bottom-24 md:bottom-16 left-0 right-0 text-center px-5">
            <p className="text-muted text-sm md:text-base max-w-md mx-auto">Adaptive ANC, 40-hour battery and a 40&nbsp;mm graphene driver — presented in real 3D. Not a video.</p>
            <p className="mt-4 font-display font-semibold text-lg">{VARIANTS[variant].name} · ${VARIANTS[variant].price}</p>
          </div>
        </div>

        {/* Act 1 — design / exploded */}
        <div className={`absolute inset-0 pointer-events-none ${panel} ${show(1)}`}>
          <div className="absolute left-5 md:left-14 top-1/2 -translate-y-1/2 max-w-sm pointer-events-auto">
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent">01 · DESIGN</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.02] mt-3">Watch it come apart, piece by piece.</h2>
            <p className="text-muted mt-4 text-sm md:text-base leading-relaxed">36 components, one instrument. Pull the SONUS One apart in real time — cushions, drivers, yokes and shell, floating exactly where they belong.</p>
            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={toggleExplode} className={`rounded-full px-5 py-2.5 font-display font-semibold text-sm transition ${exploded ? "bg-cream text-ink" : "bg-accent text-ink hover:brightness-110"}`}>
                {exploded ? "Assemble it back" : "Exploded view"}
              </button>
              {VIEWS.map((v) => (
                <button key={v.label} onClick={v.run} className="rounded-full px-4 py-2.5 font-display font-medium text-sm border border-white/15 bg-white/5 backdrop-blur hover:border-accent/60 hover:text-accent transition">
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Act 2 — finishes */}
        <div className={`absolute inset-0 pointer-events-none ${panel} ${show(2)}`}>
          <div className="absolute right-5 md:right-14 top-1/2 -translate-y-1/2 max-w-sm pointer-events-auto text-left md:text-right">
            <p className="font-mono text-[11px] tracking-[0.35em] text-accent">02 · FINISHES</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-[1.02] mt-3">Four finishes. One sound.</h2>
            <p className="text-muted mt-4 text-sm md:text-base leading-relaxed">Pick a finish and watch the product repaint itself — live materials, live light, zero images.</p>
            <div className="flex md:justify-end gap-3 mt-6">
              {VARIANTS.map((v, i) => (
                <button key={v.name} onClick={() => setVariant(i)} aria-label={v.name} title={v.name}
                  className={`w-11 h-11 rounded-full border-2 transition-all ${variant === i ? "border-accent scale-110" : "border-white/20 hover:border-white/50"}`}
                  style={{ background: `linear-gradient(135deg, ${v.shell} 55%, ${v.accent} 55%)` }} />
              ))}
            </div>
            <p className="mt-4 font-display font-semibold text-lg">{VARIANTS[variant].name} <span className="text-muted font-body font-normal text-sm">· ${VARIANTS[variant].price}</span></p>
          </div>
        </div>

        {/* bottom chrome */}
        <div className="absolute bottom-5 left-0 right-0 flex items-end justify-between px-5 md:px-10 pointer-events-none">
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-cream/50">DRAG TO ROTATE · SCROLL TO EXPLORE</p>
          <div className="flex flex-col items-center gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`w-1.5 rounded-full transition-all duration-500 ${act === i ? "h-6 bg-accent" : "h-1.5 bg-white/25"}`} />
            ))}
          </div>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-cream/50 hidden sm:block">{Math.round(prog * 100)}%</p>
        </div>
      </div>
    </div>
  );
}
